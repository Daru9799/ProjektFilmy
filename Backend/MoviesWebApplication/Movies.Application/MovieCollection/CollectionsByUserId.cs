using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollections
{
    public class CollectionsByUserId
    {
        public class Query : IRequest<PagedResponse<MovieCollection>>
        {
            public Guid UserId;
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<MovieCollection>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<MovieCollection>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.MovieCollections
                    .Where(mc => mc.User.Id == request.UserId.ToString() && mc.Type == Domain.Entities.MovieCollection.CollectionType.Custom)
                    .AsQueryable();

                // Sortowanie
                if (!string.IsNullOrEmpty(request.OrderBy))
                {
                    if (request.OrderBy.Equals("Title", StringComparison.OrdinalIgnoreCase))
                    {
                        query = request.SortDirection == "desc"
                            ? query.OrderByDescending(mc => mc.Title)
                            : query.OrderBy(mc => mc.Title);
                    }
                    else if (request.OrderBy.Equals("LikesCounter", StringComparison.OrdinalIgnoreCase))
                    {
                        query = request.SortDirection == "desc"
                            ? query.OrderByDescending(mc => mc.LikesCounter)
                            : query.OrderBy(mc => mc.LikesCounter);
                    }
                }

                // Paginacja
                var skip = (request.PageNumber - 1) * request.PageSize;
                var data = await query
                    .Skip(skip)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                return new PagedResponse<MovieCollection>
                {
                    Data = data,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
