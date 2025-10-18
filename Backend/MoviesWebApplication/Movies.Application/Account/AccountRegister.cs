using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using MoviesWebApplication;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Account
{
    public class AccountRegister
    {
        public class RegisterCommand : IRequest<UserSessionDto>
        {
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<RegisterCommand, UserSessionDto>
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

            public async Task<UserSessionDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
            {
                if (await _userManager.Users.AnyAsync(x => x.UserName == request.UserName))
                {
                    throw new ConflictException("Już istnieje taką nazwa użytkownika.");
                }

                if (await _userManager.Users.AnyAsync(x => x.Email == request.Email))
                {
                    throw new ConflictException("Już istnieje konto o podanym adresie email");
                }

                var user = new User
                {
                    UserName = request.UserName,
                    Email = request.Email
                };

                var result = await _userManager.CreateAsync(user, request.Password);

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

                    return new UserSessionDto
                    {
                        UserName = user.UserName,
                        Token = _tokenService.CreateToken(user)
                    };
                }
                else
                {
                    throw new Exception("Nie udało się stworzyć konta użytkownika.");
                }
            }
        }
    }
}
