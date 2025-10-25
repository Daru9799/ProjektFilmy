using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using static Movies.Domain.Entities.MovieCollection;


namespace Movies.Application.MovieCollections
{
    public class CollectionsByUserId
    {
        public class Query : IRequest<PagedResponse<MovieCollectionDto>>
        {
            public Guid UserId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
            public List<MovieCollection.VisibilityMode> visibilityMode { get; set; }
            public List<MovieCollection.CollectionType> collectionType { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<MovieCollectionDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<PagedResponse<MovieCollectionDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                var query = _context.MovieCollections
                    .Where(mc => mc.User.Id == request.UserId.ToString())
                    .Include(mc => mc.Movies)
                    .Include(mc => mc.User)
                    .AsQueryable();

                //Zwracanie kolekcji w zależności od relacji
                if (currentUserId != null)
                {
                    query = query.Where(mc =>
                        mc.ShareMode == MovieCollection.VisibilityMode.Public
                        || mc.User.Id == currentUserId // właściciel widzi wszystko
                        || (mc.ShareMode == MovieCollection.VisibilityMode.Friends &&
                            _context.UserRelations.Any(ur =>
                                ur.Type == UserRelation.RelationType.Friend &&
                                ((ur.FirstUserId == mc.User.Id && ur.SecondUserId == currentUserId) ||
                                 (ur.SecondUserId == mc.User.Id && ur.FirstUserId == currentUserId))
                            )
                        )
                    )
                    //Pod bloka
                    .Where(mc =>
                        !_context.UserRelations.Any(ur =>
                            ur.Type == UserRelation.RelationType.Blocked &&
                            ((ur.FirstUserId == mc.User.Id && ur.SecondUserId == currentUserId) ||
                             (ur.SecondUserId == mc.User.Id && ur.FirstUserId == currentUserId))
                        )
                    );
                }
                else
                {
                    query = query.Where(mc => mc.ShareMode == MovieCollection.VisibilityMode.Public);
                }

                if (request.collectionType != null)
                {
                    query = query.Where(mc => request.collectionType.Contains(mc.Type));
                }

                // Sortowanie
                if (!string.IsNullOrEmpty(request.OrderBy))
                {
                    if (request.OrderBy.Equals("Title", StringComparison.OrdinalIgnoreCase))
                    {
                        query = request.SortDirection == "desc"
                            ? query.OrderByDescending(mc => mc.Title)
                            : query.OrderBy(mc => mc.Title);
                    }
                    else if (request.OrderBy.Equals("LikesCounter", StringComparison.OrdinalIgnoreCase))
                    {
                        query = request.SortDirection == "desc"
                            ? query.OrderByDescending(mc => mc.LikesCounter)
                            : query.OrderBy(mc => mc.LikesCounter);
                    }
                }

                // Paginacja
                var skip = (request.PageNumber - 1) * request.PageSize;
                var data = await query
                    .Skip(skip)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                // Konwersja MovieCollection na MovieCollectionDto
                var movieCollectionDtos = data.Select(mc => new MovieCollectionDto
                {
                    MovieCollectionId = mc.MovieCollectionId,
                    Title = mc.Title,
                    Description = mc.Description,
                    ShareMode = mc.ShareMode.ToString(),
                    AllowCopy = mc.AllowCopy,
                    CollectionType = mc.Type.ToString(),
                    LikesCounter = mc.LikesCounter,
                    UserName = mc.User.UserName,
                    UserId = mc.User.Id,
                    Movies = mc.Movies.Take(5).Select(m => new MovieDto // bierze 5 filmów
                    {
                        MovieId = m.MovieId,
                        Title = m.Title,
                        PosterUrl=m.PosterUrl

                    }).ToList()
                }).ToList();

                // Obliczenie całkowitej liczby elementów
                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<MovieCollectionDto>
                {
                    Data = movieCollectionDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
