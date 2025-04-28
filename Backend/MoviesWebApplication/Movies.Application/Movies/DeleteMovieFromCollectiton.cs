using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;

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

            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<MovieCollection> Handle(DeleteMovieFromCollectionCommand request, CancellationToken cancellationToken)
            {
                // Znajdź kolekcję filmów wraz z filmami
                var collection = await _dataContext.MovieCollections
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                if (collection == null)
                    throw new Exception("Nie znaleziono kolekcji.");

                // Znajdź film w kolekcji
                var movieToRemove = collection.Movies.FirstOrDefault(m => m.MovieId == request.MovieId);

                if (movieToRemove == null)
                    throw new InvalidOperationException("Film nie istnieje w tej kolekcji.");

                // Usuń film z kolekcji
                collection.Movies.Remove(movieToRemove);

                // Zapisz zmiany
                await _dataContext.SaveChangesAsync(cancellationToken);

                return collection;
            }
        }
    }
}
