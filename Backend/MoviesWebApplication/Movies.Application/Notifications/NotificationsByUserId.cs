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
            public string Type { get; set; }
            public bool NoPagination { get; set; }
            public string SourceUserName { get; set; }
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

                //Sprawdzenie po typie
                if (!string.IsNullOrEmpty(request.Type))
                {
                    query = query.Where(n => n.Type.ToString() == request.Type);
                }

                //Sprawdzenie po źródle
                if (!string.IsNullOrEmpty(request.SourceUserName))
                {
                    query = query.Where(n => n.SourceUser != null && n.SourceUser.UserName == request.SourceUserName);
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
                if (request.NoPagination)
                {
                    var notifications = await query.ToListAsync(cancellationToken);

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
                        SourceUserName = n.SourceUser?.UserName ?? "System"
                    }).ToList();

                    return new PagedResponse<NotificationDto>
                    {
                        Data = notificationDtos,
                        TotalItems = notificationDtos.Count,
                        PageNumber = 1,
                        PageSize = notificationDtos.Count
                    };
                }
                else
                {
                    var notifications = await query
                        .Skip((request.PageNumber - 1) * request.PageSize)
                        .Take(request.PageSize)
                        .ToListAsync(cancellationToken);

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
                        SourceUserName = n.SourceUser?.UserName ?? "System"
                    }).ToList();

                    int totalItems = await query.CountAsync(cancellationToken);

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
}
