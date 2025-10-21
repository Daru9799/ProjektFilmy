using MediatR;
using Movies.Domain.DTOs;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Movies.Application._Common.Exceptions;

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
        private readonly IHttpContextAccessor _httpContextAccessor;

        public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<PagedResponse<UserAchievementDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var currentUserName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

            if (currentUserName == null)
            {
                throw new UnauthorizedException("Nie jesteś zalogowany");
            }
            if(!string.Equals(currentUserName, request.UserName, StringComparison.OrdinalIgnoreCase))
            {
                throw new ForbidenException($"Jako użytkownik {currentUserName} nie masz dostępu do osiągnięć użytkownia {request.UserName}");
            }

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
                    Description = ua.Achievement.Description,
                    ImageUrl = ua.Achievement.ImageUrl
                },
            }).ToList();

            if (userAchievementDtos == null || !userAchievementDtos.Any())
            {
                throw new NotFoundException($"Nie znaleziono osiągnięć!");
            }

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
