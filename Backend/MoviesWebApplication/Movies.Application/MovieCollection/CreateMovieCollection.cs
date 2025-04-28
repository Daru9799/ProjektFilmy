using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
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
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<CreateMovieCollectionCommand, MovieCollection>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollection> Handle(CreateMovieCollectionCommand request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                if (user == null)
                {
                    throw new InvalidOperationException("Użytkownik nie istnieje.");
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
                    Movies = new List<Movie>(),
                };

                await _context.MovieCollections.AddAsync(newCollection, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return newCollection;
            }
        }
    }
}