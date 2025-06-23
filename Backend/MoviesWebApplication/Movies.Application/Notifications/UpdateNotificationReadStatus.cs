using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

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
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                var notification = await _context.Notifications
                    .FirstOrDefaultAsync(n => n.NotificationId == request.NotificationId, cancellationToken);

                if (notification == null)
                {
                    throw new ValidationException($"Nie znaleziono powiadomienia o ID {request.NotificationId}");
                }
                    
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (notification.TargetUserId != currentUserId)
                {
                    throw new UnauthorizedAccessException("Nie masz uprawnień do odznaczenia, że to powiadomienie zostało odczytane!");
                }

                notification.IsRead = request.IsRead;

                return await _context.SaveChangesAsync(cancellationToken) > 0;
            }
        }
    }
}
