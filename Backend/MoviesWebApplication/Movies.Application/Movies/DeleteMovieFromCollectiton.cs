using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System.Security.Claims;

namespace Movies.Application.Movies
{
    public class DeleteMovieFromCollection
    {
        public class DeleteMovieFromCollectionCommand : IRequest<MovieCollection>
        {
            public Guid MovieCollectionId { get; set; }
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<DeleteMovieFromCollectionCommand, MovieCollection>
        {
            private readonly DataContext _dataContext;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext dataContext, IHttpContextAccessor httpContextAccessor)
            {
                _dataContext = dataContext;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(DeleteMovieFromCollectionCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }

                // Pobieranie kolekcji razem z właścicielem i filmami
                var collection = await _dataContext.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                if (collection == null)
                    throw new Exception("Nie znaleziono kolekcji.");

                // Sprawdzenie właściciela kolekcji
                if (collection.User.Id != currentUserId)
                    throw new UnauthorizedAccessException("Nie masz uprawnień do edytowania tej kolekcji.");

                // Znajdź film w kolekcji
                var movieToRemove = collection.Movies.FirstOrDefault(m => m.MovieId == request.MovieId);

                if (movieToRemove == null)
                    throw new InvalidOperationException("Film nie istnieje w tej kolekcji.");

                collection.Movies.Remove(movieToRemove);

                await _dataContext.SaveChangesAsync(cancellationToken);

                return collection;
            }
        }
    }
}

