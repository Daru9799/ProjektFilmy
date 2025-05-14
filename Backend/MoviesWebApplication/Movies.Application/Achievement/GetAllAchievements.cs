using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.Achievements
{
    public class GetAllAchievements
    {
        public class Query : IRequest<PagedResponse<AchievementDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<AchievementDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<AchievementDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Achievement> query = _context.Achievements.OrderBy(a => a.Title);

                var achievements = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                
                var achievementsDto = achievements.Select(r => new AchievementDto
                {
                    AchievementId = r.AchievementId,
                    Title = r.Title,
                    Description = r.Description 
                }).ToList(); 

                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<AchievementDto>
                {
                    Data = achievementsDto,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
