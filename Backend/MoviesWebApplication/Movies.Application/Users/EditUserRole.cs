using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
            public string CurrentUserId { get; set; } //Check kto próbuje wykonać polecenie
        }

        public class Handler : IRequestHandler<Command, bool>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                //Najpierw sprawdzam czy zmiany próbuje dokonać moderator
                var currentUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == request.CurrentUserId, cancellationToken);

                if (currentUser == null || currentUser.UserRole != User.Role.Mod)
                    throw new UnauthorizedAccessException();

                //Poszukiwanie usera któremu należy zmienić rolę
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null) return false;

                if (!Enum.TryParse<Domain.Entities.User.Role>(request.NewRole, true, out var parsedRole))
                    return false;

                user.UserRole = parsedRole;

                _context.Users.Update(user);

                return await _context.SaveChangesAsync(cancellationToken) > 0;
            }
        }
    }
}
