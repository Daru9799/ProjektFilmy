using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.Users
{
    public class DeleteFollowFromMovie
    {
        public class DeleteFollowFromMovieCommand : IRequest<Movie>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<DeleteFollowFromMovieCommand, Movie>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Movie> Handle(DeleteFollowFromMovieCommand request, CancellationToken cancellationToken)
            {
                //Sprawdzenie czy user jest zalogowany
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                var movie = await _context.Movies
                    .Include(m => m.Followers)
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                {
                    throw new NotFoundException("Nie znaleziono filmu.");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException("Nie znaleziono użytkownika.");
                }

                // Sprawdzenie czy użytkownik faktycznie obserwuje ten film
                if (movie.Followers.FirstOrDefault(f => f.Id == user.Id) == null)
                {
                    throw new NotFoundException("Użytkownik nie obserwuje tego filmu.");
                }
                    
                movie.Followers.Remove(user);

                await _context.SaveChangesAsync(cancellationToken);

                return movie;
            }

        }
    }
}
