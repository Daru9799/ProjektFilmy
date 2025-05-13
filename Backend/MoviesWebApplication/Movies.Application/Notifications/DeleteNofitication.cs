using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Notifications
{
    public class DeleteNotification : IRequest<Notification>
    {
        public Guid NotificationId { get; set; }

        public DeleteNotification(Guid notificationId)
        {
            NotificationId = notificationId;
        }
    }
    public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotification, Notification>
    {
        private readonly DataContext _context;

        public DeleteNotificationCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Notification> Handle(DeleteNotification request, CancellationToken cancellationToken)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == request.NotificationId, cancellationToken);

            if (notification == null)
            {
                return null;
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync(cancellationToken);

            return notification;
        }
    }
}
