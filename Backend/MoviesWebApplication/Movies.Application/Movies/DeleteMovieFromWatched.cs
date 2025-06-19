using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Movies
{
    public class DeleteMovieFromWatched
    {
        public class DeleteMovieFromWatchedCommand : IRequest<MovieCollection>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<DeleteMovieFromWatchedCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(DeleteMovieFromWatchedCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }
                    
                var collection = await _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.User.Id == currentUserId && mc.Type == MovieCollection.CollectionType.Watched, cancellationToken);

                if (collection == null)
                {
                    throw new Exception("Nie znaleziono listy obejrzanych.");
                }
                    
                var movie = collection.Movies.FirstOrDefault(m => m.MovieId == request.MovieId);

                if (movie == null)
                {
                    throw new InvalidOperationException("Film nie znajduje się na liście obejrzanych.");
                }
                    
                collection.Movies.Remove(movie);
                await _context.SaveChangesAsync(cancellationToken);

                return collection;
            }
        }
    }
}
