using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollections
{
    public class MovieCollectionList
    {
        public class Query : IRequest<PagedResponse<MovieCollectionDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
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
                IQueryable<MovieCollection> query = _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                    .OrderBy(mc => mc.Title); 

                // Paginacja
                var movieCollections = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                // Mapowanie kolekcji filmów do DTO
                var movieCollectionsDto = movieCollections.Select(mc => new MovieCollectionDto
                {
                    MovieCollectionId = mc.MovieCollectionId,
                    Title = mc.Title,
                    Description = mc.Description,
                    ShareMode = mc.ShareMode.ToString(),
                    AllowCopy = mc.AllowCopy,
                    CollectionType = mc.Type.ToString(),
                    LikesCounter = mc.LikesCounter,
                    UserName = mc.User.UserName,
                    UserId = mc.User.Id,
                    Movies = mc.Movies.Select(m => new MovieDto
                    {
                        MovieId = m.MovieId, 
                        Title = m.Title,   // nie przypisuje wszystkiego bo po co
                    }).ToList()
                }).ToList();


                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<MovieCollectionDto>
                {
                    Data = movieCollectionsDto,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
