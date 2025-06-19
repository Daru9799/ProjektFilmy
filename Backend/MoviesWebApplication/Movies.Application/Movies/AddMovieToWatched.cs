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
    public class AddMovieToWatched
    {
        public class AddMovieToWatchedCommand : IRequest<MovieCollection>
        {
            public Guid MovieId { get; set; }
        }
        public class Handler : IRequestHandler<AddMovieToWatchedCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(AddMovieToWatchedCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
                }

                //Sprawdzenie czy nie jest już na liście obejrzanych i czy lista istnieje
                var watchedCollection = await _context.MovieCollections
                    .Include(mc => mc.Movies)
                    .Include(mc => mc.User)
                    .FirstOrDefaultAsync(mc => mc.User.Id == currentUserId && mc.Type == MovieCollection.CollectionType.Watched, cancellationToken);

                if (watchedCollection == null)
                {
                    throw new Exception("Nie znaleziono listy obejrzanych.");
                }

                if (watchedCollection.Movies.Any(m => m.MovieId == request.MovieId))
                {
                    throw new InvalidOperationException("Film już istnieje w liście obejrzanych.");
                }

                //Usuwa z planowanych (jeśli film tam jest)
                var plannedCollection = await _context.MovieCollections
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.User.Id == currentUserId && mc.Type == MovieCollection.CollectionType.Planned, cancellationToken);

                if (plannedCollection != null)
                {
                    var movieInPlanned = plannedCollection.Movies.FirstOrDefault(m => m.MovieId == request.MovieId);
                    if (movieInPlanned != null)
                    {
                        plannedCollection.Movies.Remove(movieInPlanned);
                    }
                }

                var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                {
                    throw new Exception("Nie znaleziono filmu.");
                }

                //Dodanie do obejrzanych
                watchedCollection.Movies.Add(movie);

                await _context.SaveChangesAsync(cancellationToken);

                return watchedCollection;
            }
        }
    }
}
