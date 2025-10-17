using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.Users
{
    public class EditUserRole
    {
        public class Command : IRequest<bool>
        {
            public string UserId { get; set; }
            public string NewRole { get; set; }
        }

        public class Handler : IRequestHandler<Command, bool>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                //Najpierw sprawdzam czy zmiany próbuje dokonać moderator
                var currentUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (currentUser == null || currentUser.UserRole != User.Role.Mod)
                {
                    throw new ForbidenException("Tylko moderator może zmieniać role użytkowników.");
                }

                //Poszukiwanie usera któremu należy zmienić rolę
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException("Nie znaleziono użytkownika któremu miała być zmieniona rola");
                }

                if (!Enum.TryParse<Domain.Entities.User.Role>(request.NewRole, true, out var parsedRole))
                {
                    throw new BadRequestException("Podana rola jest źle wprowadzona, lub rola ta nie istnieje.");
                }
                    
                user.UserRole = parsedRole;

                _context.Users.Update(user);

                return await _context.SaveChangesAsync(cancellationToken) > 0;
            }
        }
    }
}
