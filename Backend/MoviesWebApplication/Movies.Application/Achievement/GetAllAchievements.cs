using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.Achievements
{
    public class GetAllAchievements
    {
        public class Query:IRequest<PagedResponse<Achievement>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }


        public class Handler : IRequestHandler<Query, PagedResponse<Achievement>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<Achievement>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Achievement> query = _context.Achievements.OrderBy(a=>a.Title);

                var achievements = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<Achievement>
                {
                    Data = achievements,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
