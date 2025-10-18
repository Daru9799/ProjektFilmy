using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.Account
{
    public class AccountChangePassword
    {
        public class ChangePasswordCommand : IRequest<bool>
        {
            public string CurrentPassword { get; set; }
            public string NewPassword { get; set; }
            public ClaimsPrincipal User { get; set; }
        }

        public class Handler : IRequestHandler<ChangePasswordCommand, bool>
        {
            private readonly UserManager<User> _userManager;

            public Handler(UserManager<User> userManager)
            {
                _userManager = userManager;
            }

            public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
            {
                var userId = request.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                {
                    throw new UnauthorizedException("Nie można zweryfikować użytkownika.");
                }

                var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId);

                if (user == null)
                {
                    throw new NotFoundException("Nie znaleziono użytkownika.");
                }

                if (user.IsGoogleUser)
                {
                    throw new BadRequestException("Nie można zmienić hasła dla konta Google.");
                }

                var passwordVerificationResult = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.NewPassword);

                if (passwordVerificationResult == PasswordVerificationResult.Success)
                {
                    throw new BadRequestException("Nowe hasło musi się różnić od aktualnego.");
                }

                var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

                if (!result.Succeeded)
                {
                    if (result.Errors.Any(e => e.Code == "PasswordMismatch"))
                    {
                        throw new UnauthorizedException("Podano nieprawidłowe obecne hasło.");
                    }
                }

                return true;
            }
        }
    }
}
