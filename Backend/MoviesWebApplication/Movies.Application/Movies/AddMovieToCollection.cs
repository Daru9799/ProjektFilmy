using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;

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

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollection> Handle(AddMovieToCollectionCommand request, CancellationToken cancellationToken)
            {
                // Pobieranie kolekcji razem z filmami
                var collection = await _context.MovieCollections
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                if (collection == null)
                    throw new Exception("Nie znaleziono kolekcji.");

                // Pobieranie filmu
                var movie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                    throw new Exception("Nie znaleziono filmu.");

                // SPRAWDZENIE, czy film już jest w kolekcji
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
