using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Infrastructure;


namespace Movies.Application.MovieCollections
{
    public class CollectionsByUserId
    {
        public class Query : IRequest<PagedResponse<MovieCollectionDto>>
        {
            public Guid UserId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<MovieCollectionDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<MovieCollectionDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.MovieCollections
                    .Where(mc => mc.User.Id == request.UserId.ToString() && mc.Type == Domain.Entities.MovieCollection.CollectionType.Custom)
                    .Include(mc => mc.Movies)
                    .Include(mc => mc.User) 
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

                // Konwersja MovieCollection na MovieCollectionDto
                var movieCollectionDtos = data.Select(mc => new MovieCollectionDto
                {
                    MovieCollectionId = mc.MovieCollectionId,
                    Title = mc.Title,
                    Description = mc.Description,
                    ShareMode = mc.ShareMode.ToString(),
                    AllowCopy = mc.AllowCopy,
                    CollectionType = mc.Type.ToString(),
                    LikesCounter = mc.LikesCounter,
                    UserName = mc.User.UserName,
                    Movies = mc.Movies.Select(m => new MovieDto
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        PosterUrl=m.PosterUrl

                    }).ToList()
                }).ToList();

                // Obliczenie całkowitej liczby elementów
                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<MovieCollectionDto>
                {
                    Data = movieCollectionDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
