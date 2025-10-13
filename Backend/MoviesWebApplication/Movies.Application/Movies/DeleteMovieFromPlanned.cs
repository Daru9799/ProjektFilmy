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
    public class DeleteMovieFromPlanned
    {
        public class DeleteMovieFromPlannedCommand : IRequest<MovieCollection>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<DeleteMovieFromPlannedCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(DeleteMovieFromPlannedCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }
                    
                var collection = await _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.User.Id == currentUserId && mc.Type == MovieCollection.CollectionType.Planned, cancellationToken);

                if (collection == null)
                {
                    throw new KeyNotFoundException("Nie znaleziono listy planowanych.");
                }

                var movie = collection.Movies.FirstOrDefault(m => m.MovieId == request.MovieId);

                if (movie == null)
                {
                    throw new KeyNotFoundException("Nie znaleziono filmu na liście planowanych filmów.");
                }

                collection.Movies.Remove(movie);
                await _context.SaveChangesAsync(cancellationToken);

                return collection;
            }
        }
    }
}
