using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.DTOs;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollections
{
    public class CollectionById
    {
        public class Query : IRequest<MovieCollectionDto>
        {
            public Guid Id { get; set; }
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
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.Id, cancellationToken);

                if (collection == null)
                {
                    return null;
                }

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
                    Movies = collection.Movies.Select(m => new MovieDto
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        PosterUrl=m.PosterUrl,
                    }).ToList()
                };

                return collectionDto;
            }
        }
    }
}
