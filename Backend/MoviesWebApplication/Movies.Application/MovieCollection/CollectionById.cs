using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollections
{
    public class CollectionById
    {
        public class Query : IRequest<MovieCollectionDto>
        {
            public Guid Id { get; set; }
            public int PageNumber { get; set; } = 1;
            public int PageSize { get; set; } = 10;
        }

        public class Handler : IRequestHandler<Query, MovieCollectionDto>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollectionDto?> Handle(Query request, CancellationToken cancellationToken)
            {
                var collection = await _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                        .ThenInclude(m => m.Reviews) 
                    .FirstOrDefaultAsync(mc => mc.MovieCollectionId == request.Id, cancellationToken);


                if (collection == null)
                {
                    return null;
                }

                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                //Jeśli kolekcja prywatna i nie właściciel → brak dostępu
                if (collection.ShareMode == MovieCollection.VisibilityMode.Private &&
                    collection.User.Id != currentUserId)
                {
                    throw new NotFoundException("Nie możesz zobaczyć tej kolekcji.");
                }

                //Jeśli użytkownik nie jest właścicielem, sprawdzamy blokady i znajomych
                if (collection.User.Id != currentUserId && currentUserId != null)
                {
                    var userRelation = await _context.UserRelations
                        .FirstOrDefaultAsync(ur =>
                            (ur.FirstUserId == collection.User.Id && ur.SecondUserId == currentUserId) ||
                            (ur.SecondUserId == collection.User.Id && ur.FirstUserId == currentUserId),
                            cancellationToken
                        );

                    //Zablokowany
                    if (userRelation != null && userRelation.Type == UserRelation.RelationType.Blocked)
                        throw new NotFoundException("Nie możesz zobaczyć tej kolekcji.");

                    //Znajomi
                    if (collection.ShareMode == MovieCollection.VisibilityMode.Friends &&
                        (userRelation == null || userRelation.Type != UserRelation.RelationType.Friend))
                    {
                        throw new NotFoundException("Nie możesz zobaczyć tej kolekcji.");
                    }
                }

                //Niezalogowani widzą tylko publiczne
                if (currentUserId == null && collection.ShareMode != MovieCollection.VisibilityMode.Public)
                {
                    throw new NotFoundException("Nie możesz zobaczyć tej kolekcji.");
                }


                // Paginacja filmów
                var pagedMovies = collection.Movies
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .Select(m => new MovieDto
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        PosterUrl = m.PosterUrl,
                        Description= m.Description,
                        ReviewsNumber =m.Reviews?.Count ?? 0,
                        ScoresNumber = m.Reviews?.Count(r => r.Rating > 0) ?? 0,
                        AverageScore = m.Reviews != null && m.Reviews.Any(r => r.Rating > 0)
                            ? m.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating)
                            : 0,

                    })
                .ToList();

                var collectionDto = new MovieCollectionDto
                {
                    MovieCollectionId = collection.MovieCollectionId,
                    Title = collection.Title,
                    Description = collection.Description,
                    ShareMode = collection.ShareMode.ToString(),
                    AllowCopy = collection.AllowCopy,
                    CollectionType = collection.Type.ToString(),
                    LikesCounter = collection.LikesCounter,
                    UserName = collection.User.UserName,
                    Movies = pagedMovies,
                    UserId = collection.User.Id
                };

                if (collection.Movies == null)
                {
                    throw new NotFoundException($"Nie odnaleziono listy filmów z id {request.Id}.");
                }

                return collectionDto;
            }
        }
    }
}
