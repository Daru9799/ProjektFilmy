// Application/Users/Commands/Login/LoginCommand.cs
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using MoviesWebApplication;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Users.Commands.Login
{
    public class AccountLogin
    {
        public class LoginCommand : IRequest<UserSessionDto>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<LoginCommand, UserSessionDto>
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

            public async Task<UserSessionDto> Handle(LoginCommand request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                if (user == null)
                {
                    throw new UnauthorizedException("Błędny adres email lub hasło.");
                }

                var result = await _userManager.CheckPasswordAsync(user, request.Password);

                if (result)
                {
                    await EnsureDefaultCollections(user);
                    return new UserSessionDto
                    {
                        UserName = user.UserName,
                        Token = _tokenService.CreateToken(user)
                    };
                }
                else
                {
                    throw new UnauthorizedException("Błędny adres email lub hasło.");
                }
            }

            private async Task EnsureDefaultCollections(User user)
            {
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