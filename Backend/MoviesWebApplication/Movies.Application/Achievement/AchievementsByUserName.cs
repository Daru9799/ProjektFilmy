using MediatR;
using Movies.Domain.DTOs;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

public class AchievementsByUserName
{
    public class Query : IRequest<PagedResponse<UserAchievementDto>>
    {
        public string UserName { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string OrderBy { get; set; }
        public string SortDirection { get; set; }
    }

    public class Handler : IRequestHandler<Query, PagedResponse<UserAchievementDto>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<UserAchievementDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = _context.UserAchievements
                .Include(ua => ua.User)
                .Include(ua => ua.Achievement)
                .Where(ua => ua.User.UserName == request.UserName);

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

            var skip = (request.PageNumber - 1) * request.PageSize;
            var data = await query
                .Skip(skip)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            int totalItems = await query.CountAsync(cancellationToken);


            var userAchievementDtos = data.Select(ua => new UserAchievementDto
            {
                UserAchievementId = ua.UserAchievementId,
                Date = ua.Date,
                Achievement = new AchievementDto
                {
                    AchievementId = ua.Achievement.AchievementId,
                    Title = ua.Achievement.Title,
                    Description = ua.Achievement.Description
                },
            }).ToList();

            return new PagedResponse<UserAchievementDto>
            {
                Data = userAchievementDtos,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalItems = totalItems
            };
        }
    }
}
