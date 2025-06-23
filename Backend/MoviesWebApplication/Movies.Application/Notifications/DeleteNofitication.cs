using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

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
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteNotificationCommandHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Notification> Handle(DeleteNotification request, CancellationToken cancellationToken)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == request.NotificationId, cancellationToken);

            if (notification == null)
            {
                return null;
            }

            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (notification.TargetUserId != currentUserId)
            {
                throw new UnauthorizedAccessException("Nie masz uprawnień do usunięcia tego powiadomienia!");
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync(cancellationToken);

            return notification;
        }
    }
}
