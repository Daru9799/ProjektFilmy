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
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Movies
{
    public class AddMovieToPlanned
    {
        public class AddMovieToPlannedCommand : IRequest<MovieCollection>
        {
            public Guid MovieId { get; set; }
        }
        public class Handler : IRequestHandler<AddMovieToPlannedCommand, MovieCollection>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollection> Handle(AddMovieToPlannedCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany.");
                }

                //Sprwadzenie czy lista planowanych istnieje lub posiada już ten film 
                var plannedCollection = await _context.MovieCollections
                    .Include(mc => mc.Movies)
                    .Include(mc => mc.User)
                    .FirstOrDefaultAsync(mc => mc.User.Id == currentUserId && mc.Type == MovieCollection.CollectionType.Planned, cancellationToken);

                if (plannedCollection == null)
                {
                    throw new NotFoundException("Nie znaleziono listy planowanych filmów.");
                }

                if (plannedCollection.Movies.Any(m => m.MovieId == request.MovieId))
                {
                    throw new ConflictException("Film już istnieje w liście planowanych.");
                }

                //Usuwanie z obejrzanych (jeśli tam jest)
                var watchedCollection = await _context.MovieCollections
                    .Include(mc => mc.Movies)
                    .FirstOrDefaultAsync(mc => mc.User.Id == currentUserId && mc.Type == MovieCollection.CollectionType.Watched, cancellationToken);

                if (watchedCollection != null)
                {
                    var movieInWatched = watchedCollection.Movies.FirstOrDefault(m => m.MovieId == request.MovieId);
                    if (movieInWatched != null)
                    {
                        watchedCollection.Movies.Remove(movieInWatched);
                    }
                }

                var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                {
                    throw new NotFoundException("Nie znaleziono filmu.");
                }

                //Dodanie filmu do listy planowanych
                plannedCollection.Movies.Add(movie);

                await _context.SaveChangesAsync(cancellationToken);

                return plannedCollection;
            }
        }
    }
}
