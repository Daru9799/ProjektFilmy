using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollections
{
    public class CollectionById
    {
        public class Query : IRequest<MovieCollectionDto>
        {
            public Guid Id { get; set; }
            public int PageNumber { get; set; } = 1;
            public int PageSize { get; set; } = 10;
        }

        public class Handler : IRequestHandler<Query, MovieCollectionDto>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollectionDto?> Handle(Query request, CancellationToken cancellationToken)
            {
                var collection = await _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                        .ThenInclude(m => m.Reviews) 
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.Id, cancellationToken);


                if (collection == null)
                {
                    return null;
                }

                // Paginacja filmów
                var pagedMovies = collection.Movies
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(m => new MovieDto
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        PosterUrl = m.PosterUrl,
                        Description= m.Description,
                        ReviewsNumber =m.Reviews?.Count ?? 0,
                        ScoresNumber = m.Reviews?.Count(r => r.Rating > 0) ?? 0,
                        AverageScore = m.Reviews != null && m.Reviews.Any(r => r.Rating > 0)
                            ? m.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating)
                            : 0,

                    })
                .ToList();

                var collectionDto = new MovieCollectionDto
                {
                    MovieCollectionId = collection.MovieCollectionId,
                    Title = collection.Title,
                    Description = collection.Description,
                    ShareMode = collection.ShareMode.ToString(),
                    AllowCopy = collection.AllowCopy,
                    CollectionType = collection.Type.ToString(),
                    LikesCounter = collection.LikesCounter,
                    UserName = collection.User.UserName,
                    Movies = pagedMovies
                };

                return collectionDto;
            }
        }
    }
}
