using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.Achievements
{
    public class AchievementsByUserId
    {
        public class Query:IRequest<PagedResponse<UserAchievement>>
        {
            public Guid UserId;
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
        }

        public class Handler:IRequestHandler<Query, PagedResponse<UserAchievement>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<UserAchievement>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.UserAchievements
                    .Where(ua => ua.User.Id == request.UserId.ToString());

                if (!string.IsNullOrEmpty(request.OrderBy))
                {
                    if (request.OrderBy.Equals("Date", StringComparison.OrdinalIgnoreCase))
                    {
                        query = request.SortDirection?.ToLower() == "desc"
                            ? query.OrderByDescending(ua => ua.Date)
                            : query.OrderBy(ua => ua.Date);
                    }
                    else if (request.OrderBy.Equals("Title", StringComparison.OrdinalIgnoreCase))
                    {
                        query = request.SortDirection?.ToLower() == "desc"
                            ? query.OrderByDescending(ua => ua.Achievement.Title)
                            : query.OrderBy(ua => ua.Achievement.Title);
                    }
                }

                // Paginacja
                var skip = (request.PageNumber - 1) * request.PageSize;
                var data = await query
                    .Skip(skip)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                return new PagedResponse<UserAchievement>
                {
                    Data = data,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };

            }
        }
    }
}
