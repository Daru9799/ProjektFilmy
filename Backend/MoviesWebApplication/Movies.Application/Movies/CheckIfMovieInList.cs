using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Movies
{
    public class CheckIfMovieInList
    {
        public class Query : IRequest<bool>
        {
            public Guid MovieId { get; set; }
            public string ListType { get; set; } //"planned" lub "watched"
        }

        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }

                var collectionType = request.ListType.ToLower() switch
                {
                    "planned" => Domain.Entities.MovieCollection.CollectionType.Planned,
                    "watched" => Domain.Entities.MovieCollection.CollectionType.Watched,
                    _ => throw new ArgumentException("Nieprawidłowy typ listy.")
                };

                var collection = await _context.MovieCollections
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc =>
                        mc.User.Id == currentUserId && mc.Type == collectionType, cancellationToken);

                if (collection == null)
                {
                    return false;
                }

                return collection.Movies.Any(m => m.MovieId == request.MovieId);
            }
        }
    }
}
