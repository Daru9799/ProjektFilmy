using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.MovieCollections
{
    public class DeleteMovieCollection : IRequest<MovieCollection>
    {
        public Guid MovieCollectionId { get; set; }

        public DeleteMovieCollection(Guid id)
        {
            MovieCollectionId = id;
        }

        public class DeleteMovieCollectionCommand : IRequestHandler<DeleteMovieCollection, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public DeleteMovieCollectionCommand(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(DeleteMovieCollection request, CancellationToken cancellationToken)
            {
                Console.WriteLine($"Attempting to delete MovieCollection with ID: {request.MovieCollectionId}");

                // Pobranie ID aktualnie zalogowanego użytkownika
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany."); 
                }

                var movieCollection = await _context.MovieCollections
                    .Include(m => m.User)
                    .FirstOrDefaultAsync(m => m.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                if (movieCollection == null)
                {
                    throw new NotFoundException($"Nie znaleziono listy filmów o ID: {request.MovieCollectionId}");
                }

                // Sprawdzenie, czy aktualny użytkownik jest właścicielem kolekcji
                if (movieCollection.User.Id != currentUserId)
                {
                    throw new ForbidenException("Nie masz uprawnień do usunięcia tej kolekcji.");
                }

                _context.MovieCollections.Remove(movieCollection);
                await _context.SaveChangesAsync(cancellationToken);

                return movieCollection;
            }
        }
    }
}
