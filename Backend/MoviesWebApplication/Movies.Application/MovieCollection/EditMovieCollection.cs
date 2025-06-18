using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using static Movies.Domain.Entities.MovieCollection;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Movies.Application.MovieCollections
{
    public class EditMovieCollection
    {
        public class EditMovieCollectionCommand : IRequest<MovieCollection>
        {
            public Guid MovieCollectionId { get; set; }
            public CollectionType? Type { get; set; }
            public VisibilityMode? ShareMode { get; set; }
            public string? Title { get; set; }
            public string? Description { get; set; }
            public bool? AllowCopy { get; set; }
            public int? LikesCounter { get; set; }
            public List<Guid>? MovieIds { get; set; }
        }

        public class Handler : IRequestHandler<EditMovieCollectionCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(EditMovieCollectionCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");

                var movieCollection = await _context.MovieCollections
                    .Include(m => m.User)
                    .Include(m => m.Movies) // Załaduj powiązane filmy
                    .FirstOrDefaultAsync(m => m.MovieCollectionId == request.MovieCollectionId, cancellationToken)
                    ?? throw new InvalidOperationException("Nie znaleziono listy filmów.");

                if (movieCollection.User.Id != currentUserId)
                    throw new UnauthorizedAccessException("Nie masz uprawnień do edytowania tej kolekcji.");

                // Aktualizacja pól
                movieCollection.Title = string.IsNullOrWhiteSpace(request.Title) ? movieCollection.Title : request.Title;
                movieCollection.Description = request.Description ?? movieCollection.Description;
                movieCollection.AllowCopy = request.AllowCopy ?? movieCollection.AllowCopy;
                movieCollection.Type = request.Type ?? movieCollection.Type;
                movieCollection.ShareMode = request.ShareMode ?? movieCollection.ShareMode;
                movieCollection.LikesCounter = request.LikesCounter ?? movieCollection.LikesCounter;

                // Aktualizacja listy filmów
                if (request.MovieIds != null)
                {
                    // Wyczyść obecną listę
                    movieCollection.Movies.Clear();

                    // Pobierz nowe filmy
                    var movies = await _context.Movies
                        .Where(m => request.MovieIds.Contains(m.MovieId))
                        .ToListAsync(cancellationToken);

                    foreach (var movie in movies)
                    {
                        movieCollection.Movies.Add(movie);
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
                return movieCollection;
            }
        }
    }
}
