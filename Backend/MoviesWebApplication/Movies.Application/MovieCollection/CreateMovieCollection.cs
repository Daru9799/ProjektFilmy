using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System.Security.Claims;

namespace Movies.Application.MovieCollections
{
    public class CreateMovieCollection
    {
        public class CreateMovieCollectionCommand : IRequest<MovieCollection>
        {
            public MovieCollection.VisibilityMode ShareMode { get; set; }
            public MovieCollection.CollectionType Type { get; set; }
            public required string Title { get; set; }
            public string? Description { get; set; }
            public bool AllowCopy { get; set; }
            public List<Guid>? MovieIds { get; set; } 
        }

        public class Handler : IRequestHandler<CreateMovieCollectionCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(CreateMovieCollectionCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany.");

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (user == null)
                    throw new NotFoundException("Nie znaleziono użytkownika.");

                var collection = new MovieCollection
                {
                    MovieCollectionId = Guid.NewGuid(),
                    Title = request.Title,
                    Description = request.Description,
                    ShareMode = request.ShareMode,
                    Type = request.Type,
                    AllowCopy = request.AllowCopy,
                    LikesCounter = 0,
                    User = user,
                    Movies = new List<Movie>()
                };

                // Pobieramy i dodajemy filmy, jeśli podano
                if (request.MovieIds != null && request.MovieIds.Any())
                {
                    var movies = await _context.Movies
                        .Where(m => request.MovieIds.Contains(m.MovieId))
                        .ToListAsync(cancellationToken);

                    foreach (var movie in movies)
                    {
                        collection.Movies.Add(movie);
                    }
                }

                await _context.MovieCollections.AddAsync(collection, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return collection;
            }
        }
    }
}
