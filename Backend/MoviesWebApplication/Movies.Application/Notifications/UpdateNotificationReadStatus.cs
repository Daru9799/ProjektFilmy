using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Notifications
{
    public class UpdateNotificationReadStatus
    {
        public class Command : IRequest<bool>
        {
            public Guid NotificationId { get; set; }
            public bool IsRead { get; set; }
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
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.NotificationId == request.NotificationId, cancellationToken);

                if (notification == null)
                    throw new ValidationException($"Nie znaleziono powiadomienia o ID {request.NotificationId}");

                notification.IsRead = request.IsRead;

                return await _context.SaveChangesAsync(cancellationToken) > 0;
            }
        }
    }
}
