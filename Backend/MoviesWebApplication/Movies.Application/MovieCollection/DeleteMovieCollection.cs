using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;
using System;

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

            public DeleteMovieCollectionCommand(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollection> Handle(DeleteMovieCollection request, CancellationToken cancellationToken)
            {
                // Logowanie ID, które próbujesz usunąć
                Console.WriteLine($"Attempting to delete MovieCollection with ID: {request.MovieCollectionId}");

                // Znajdź MovieCollection w bazie danych
                var movieCollection = await _context.MovieCollections
                    .FirstOrDefaultAsync(m => m.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                // Jeśli MovieCollection nie istnieje, rzuć wyjątek
                if (movieCollection == null)
                {
                    throw new InvalidOperationException($"Nie znaleziono listy filmów o ID: {request.MovieCollectionId}");
                }

                // Usuń znalezioną MovieCollection z kontekstu
                _context.MovieCollections.Remove(movieCollection);

                // Zapisz zmiany w bazie danych
                await _context.SaveChangesAsync(cancellationToken);

                // Zwróć usuniętą kolekcję filmów
                return movieCollection;
            }
        }
    }
}
