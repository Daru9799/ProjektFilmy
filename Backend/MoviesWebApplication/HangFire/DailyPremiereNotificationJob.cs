using Microsoft.EntityFrameworkCore;
using Movies.Application.Interfaces;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace HangFire
{
    public class DailyPremiereNotificationJob
    {
        private readonly DataContext _context;
        private readonly INotificationSender _notificationSender;

        public DailyPremiereNotificationJob(DataContext context, INotificationSender notificationSender)
        {
            _context = context;
            _notificationSender = notificationSender;
        }

        public async Task ExecuteAsync()
        {
            var today = DateTime.UtcNow.Date;

            var moviesWithPremiereToday = await _context.Movies
                .Include(m => m.Followers)
                .Where(m => m.ReleaseDate.Date == today)
                .ToListAsync();

            if (!moviesWithPremiereToday.Any()) return;

            foreach (var movie in moviesWithPremiereToday)
            {
                foreach (var user in movie.Followers)
                {
                    var notification = new Notification
                    {
                        NotificationId = Guid.NewGuid(),
                        Title = $"Premiera filmu: {movie.Title}",
                        Description = $"Dzisiaj premiera filmu „{movie.Title}”! Nie przegap!",
                        Type = Notification.NotificationType.MovieRelease,
                        Date = DateTime.UtcNow,
                        IsRead = false,
                        Resource = $"movies/{movie.MovieId}",
                        SourceUserId = null,
                        TargetUserId = user.Id,
                        TargetUser = user
                    };

                    _context.Notifications.Add(notification);
                    await _notificationSender.SendAsync(notification);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}