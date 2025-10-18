using Google.Apis.Auth;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using MoviesWebApplication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.Account
{
    public class AccountGoogleLogin
    {
        public class GoogleLoginCommand : IRequest<UserSessionDto>
        {
            public string IdToken { get; set; }
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<GoogleLoginCommand, UserSessionDto>
        {
            private readonly UserManager<User> _userManager;
            private readonly DataContext _context;
            private readonly TokenService _tokenService;

            public Handler(UserManager<User> userManager, TokenService tokenService, DataContext context)
            {
                _userManager = userManager;
                _tokenService = tokenService;
                _context = context;
            }

            public async Task<UserSessionDto> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
                var email = payload.Email;
                var nameFromGoogle = payload.Name;

                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    if (string.IsNullOrWhiteSpace(request.UserName))
                    {
                        throw new BadRequestException("Brakuje nazwy użytkownika do rejestracji.");
                    }

                    if (await _userManager.Users.AnyAsync(x => x.UserName == request.UserName))
                    {
                        throw new ConflictException("Nazwa użytkownika jest już zajęta!");
                    }

                    user = new User
                    {
                        Email = email,
                        UserName = request.UserName,
                        IsGoogleUser = true
                    };

                    var result = await _userManager.CreateAsync(user);

                    if (result.Succeeded)
                    {
                        var watchedCollection = new MovieCollection
                        {
                            Title = "Obejrzane",
                            Description = "Lista obejrzanych filmów",
                            ShareMode = MovieCollection.VisibilityMode.Private,
                            AllowCopy = false,
                            Type = MovieCollection.CollectionType.Watched,
                            User = user
                        };

                        var plannedCollection = new MovieCollection
                        {
                            Title = "Planowane",
                            Description = "Lista filmów do obejrzenia",
                            ShareMode = MovieCollection.VisibilityMode.Private,
                            AllowCopy = false,
                            Type = MovieCollection.CollectionType.Planned,
                            User = user
                        };

                        _context.MovieCollections.Add(watchedCollection);
                        _context.MovieCollections.Add(plannedCollection);
                        await _context.SaveChangesAsync(cancellationToken);
                    }
                    else
                    {
                        throw new Exception("Nie udało się utworzyć konta.");
                    }
                }

                await EnsureDefaultCollections(user);

                return new UserSessionDto
                {
                    UserName = user.UserName,
                    Token = _tokenService.CreateToken(user)
                };
            }

            private async Task EnsureDefaultCollections(User user)
            {
                // Ta sama implementacja co w LoginCommand
                var existingCollections = await _context.MovieCollections
                    .Include(mc => mc.User)
                    .Where(mc => mc.User.Id == user.Id)
                    .Select(mc => mc.Type)
                    .ToListAsync();

                if (!existingCollections.Contains(MovieCollection.CollectionType.Watched))
                {
                    var watchedCollection = new MovieCollection
                    {
                        Title = "Obejrzane",
                        Description = "Lista obejrzanych filmów",
                        ShareMode = MovieCollection.VisibilityMode.Private,
                        AllowCopy = false,
                        Type = MovieCollection.CollectionType.Watched,
                        User = user
                    };
                    _context.MovieCollections.Add(watchedCollection);
                }

                if (!existingCollections.Contains(MovieCollection.CollectionType.Planned))
                {
                    var plannedCollection = new MovieCollection
                    {
                        Title = "Planowane",
                        Description = "Lista filmów do obejrzenia",
                        ShareMode = MovieCollection.VisibilityMode.Private,
                        AllowCopy = false,
                        Type = MovieCollection.CollectionType.Planned,
                        User = user
                    };
                    _context.MovieCollections.Add(plannedCollection);
                }

                if (_context.ChangeTracker.HasChanges())
                {
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
