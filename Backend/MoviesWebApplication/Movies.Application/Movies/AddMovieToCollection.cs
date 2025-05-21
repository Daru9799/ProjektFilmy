using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Movies.Application.Movies
{
    public class AddMovieToCollection
    {
        public class AddMovieToCollectionCommand : IRequest<MovieCollection>
        {
            public Guid MovieCollectionId { get; set; }
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<AddMovieToCollectionCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(AddMovieToCollectionCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }

                // Pobieranie kolekcji razem z właścicielem i filmami
                var collection = await _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                if (collection == null)
                    throw new Exception("Nie znaleziono kolekcji.");

                // Sprawdzenie właściciela kolekcji
                if (collection.User.Id != currentUserId)
                    throw new UnauthorizedAccessException("Nie masz uprawnień do edytowania tej kolekcji.");

                // Pobieranie filmu
                var movie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                    throw new Exception("Nie znaleziono filmu.");

                // Sprawdzenie, czy film już istnieje w kolekcji
                if (collection.Movies.Any(m => m.MovieId == movie.MovieId))
                    throw new InvalidOperationException("Film już istnieje w tej kolekcji.");

                // Dodanie filmu do kolekcji
                collection.Movies.Add(movie);

                await _context.SaveChangesAsync(cancellationToken);

                return collection;
            }
        }
    }
}
