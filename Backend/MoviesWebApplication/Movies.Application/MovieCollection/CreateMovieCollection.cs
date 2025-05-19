using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using static Movies.Domain.Entities.MovieCollection;

namespace Movies.Application.MovieCollections
{
    public class CreateMovieCollection
    {
        public class CreateMovieCollectionCommand : IRequest<MovieCollection>
        {
            public VisibilityMode ShareMode { get; set; }
            public CollectionType Type { get; set; }
            public required string Title { get; set; }
            public string? Description { get; set; }
            public bool AllowCopy { get; set; }
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
                // Pobierz ID zalogowanego użytkownika z claimów
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }

                // Znajdź użytkownika w bazie na podstawie ID
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (user == null)
                {
                    throw new InvalidOperationException("Nie znaleziono użytkownika.");
                }

                var newCollection = new MovieCollection
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

                await _context.MovieCollections.AddAsync(newCollection, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return newCollection;
            }
        }
    }
}
