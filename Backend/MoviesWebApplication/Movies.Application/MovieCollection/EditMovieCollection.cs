using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using static Movies.Domain.Entities.MovieCollection;


namespace Movies.Application.MovieCollections
{
    public class EditMovieCollection
    {
        public class EditMovieCollectionCommand : IRequest<MovieCollection>
        {
            public Guid MovieCollectionId { get; set; }
            public CollectionType? Type { get; set; }
            public VisibilityMode? ShareMode {  get; set; }
            public string? Title { get; set; }
            public string? Description { get; set; }
            public bool? AllowCopy { get; set; }
        }

        public class Handler : IRequestHandler<EditMovieCollectionCommand, MovieCollection>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollection> Handle(EditMovieCollectionCommand request, CancellationToken cancellationToken)
            {
                var movieCollection = await _context.MovieCollections
                    .FirstOrDefaultAsync(m => m.MovieCollectionId == request.MovieCollectionId, cancellationToken)
                    ?? throw new InvalidOperationException("Nie znaleziono listy filmów.");

                movieCollection.Title = string.IsNullOrWhiteSpace(request.Title) ? movieCollection.Title : request.Title;
                movieCollection.Description = request.Description ?? movieCollection.Description;
                movieCollection.AllowCopy = request.AllowCopy ?? movieCollection.AllowCopy;
                movieCollection.Type = request.Type ?? movieCollection.Type;
                movieCollection.ShareMode=request.ShareMode?? movieCollection.ShareMode;

                await _context.SaveChangesAsync(cancellationToken);

                return movieCollection;
            }

        }
    }
}
