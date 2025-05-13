using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Domain;
using Movies.Infrastructure;

namespace Movies.Application.Notifications
{
    public class NotificationsByUserId
    {
        public class Query : IRequest<PagedResponse<NotificationDto>>
        {
            public string UserId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
            public bool? IsRead { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<NotificationDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
            }

            public async Task<PagedResponse<NotificationDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Notification> query = _context.Notifications
                    .Where(n => n.TargetUserId == request.UserId)
                    .Include(n => n.SourceUser);

                //Sprwadzenie czy brac pod uwagę przeczytane/nieprzeczytane
                if (request.IsRead.HasValue)
                {
                    query = query.Where(n => n.IsRead == request.IsRead.Value);
                }

                //Obsługa sortowania
                query = (request.OrderBy?.ToLower(), request.SortDirection?.ToLower()) switch
                {
                    ("date", "desc") => query.OrderByDescending(n => n.Date),
                    ("date", "asc") => query.OrderBy(n => n.Date),
                    ("type", "asc") => query.OrderBy(n => n.Type),
                    ("type", "desc") => query.OrderByDescending(n => n.Type),
                    _ => query.OrderBy(n => n.NotificationId)
                };

                //Paginacja
                var notifications = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                int totalItems = await query.CountAsync(cancellationToken);

                var notificationDtos = notifications.Select(n => new NotificationDto
                {
                    NotificationId = n.NotificationId,
                    Title = n.Title,
                    Description = n.Description,
                    Type = n.Type.ToString(),
                    Date = n.Date,
                    IsRead = n.IsRead,
                    Resource = n.Resource,
                    SourceUserId = n.SourceUserId,
                    SourceUserName = n.SourceUser?.UserName ?? "System" //W przypadku null mamy System
                }).ToList();

                return new PagedResponse<NotificationDto>
                {
                    Data = notificationDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
