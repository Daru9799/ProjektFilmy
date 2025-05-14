using Microsoft.AspNetCore.SignalR;
using Movies.Application.Interfaces;
using Movies.Domain.Entities;
using MoviesWebApplication.Hubs;

namespace MoviesWebApplication.SignalR
{
    public class SignalRNotificationSender : INotificationSender
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationSender(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendAsync(Notification notification)
        {
            await _hubContext.Clients.Group(notification.TargetUserId)
                .SendAsync("ReceiveNotification", new
                {
                    notification.NotificationId,
                    notification.Title,
                    notification.Description,
                    Type = notification.Type.ToString(),
                    notification.Date,
                    notification.IsRead,
                    notification.Resource,
                    SourceUserId = notification.SourceUserId ?? "0",
                    SourceUserName = notification.SourceUser?.UserName ?? "System"
                });
        }
    }
}
