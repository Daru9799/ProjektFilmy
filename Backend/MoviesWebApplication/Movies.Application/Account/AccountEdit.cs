using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.Account
{
    public class AccountEdit
    {
        public class EditUserCommand : IRequest<EditUserDto>
        {
            public string NewLogin { get; set; }
            public string NewEmail { get; set; }
            public ClaimsPrincipal User { get; set; }
        }

        public class Handler : IRequestHandler<EditUserCommand, EditUserDto>
        {
            private readonly UserManager<User> _userManager;

            public Handler(UserManager<User> userManager)
            {
                _userManager = userManager;
            }

            public async Task<EditUserDto> Handle(EditUserCommand request, CancellationToken cancellationToken)
            {
                var userId = request.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    throw new UnauthorizedException("Nie można zweryfikować użytkownika.");
                }

                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

                if (user == null)
                {
                    throw new UnauthorizedException("Nie znaleziono użytkownika.");
                }

                if (user.IsGoogleUser && !string.IsNullOrEmpty(request.NewEmail) && !(user.Email == request.NewEmail))
                {
                    throw new BadRequestException("Nie można edytować adresu e-mail dla konta Google.");
                }

                if (!string.IsNullOrEmpty(request.NewEmail))
                {
                    if (await _userManager.Users.AnyAsync(u => u.Email == request.NewEmail && u.Id.ToString() != userId))
                    {
                        throw new ConflictException("Podany adres e-mail jest już używany przez innego użytkownika.");
                    }

                    user.Email = request.NewEmail;
                    var emailResult = await _userManager.UpdateAsync(user);

                    if (!emailResult.Succeeded)
                    {
                        throw new Exception($"Nie udało się zaktualizować adresu e-mail.");
                    }
                }

                if (!string.IsNullOrEmpty(request.NewLogin))
                {
                    if (await _userManager.Users.AnyAsync(u => u.UserName == request.NewLogin && u.Id.ToString() != userId))
                    {
                        throw new ConflictException("Podana nazwa użytkownika jest już zajęta.");
                    }

                    user.UserName = request.NewLogin;
                    var loginResult = await _userManager.UpdateAsync(user);

                    if (!loginResult.Succeeded)
                    {
                        throw new Exception($"Nie udało się zaktualizować nazwy użytkownika.");
                    }
                }

                return new EditUserDto { NewEmail = user.Email, NewLogin = user.UserName };
            }
        }
    }
}
