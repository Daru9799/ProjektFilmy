using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Movies.Application._Common.Exceptions;
using System.Security.Claims;

namespace Movies.Application.Users
{
    public class AddFollowToMovie
    {
        public class AddFollowToMovieCommand : IRequest<Movie>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<AddFollowToMovieCommand, Movie>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Movie> Handle(AddFollowToMovieCommand request, CancellationToken cancellationToken)
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

                if (movie.Followers.Any(u => u.Id == user.Id))
                {
                    throw new ConflictException("Użytkownik już obserwuje ten film");
                }
                    

                movie.Followers.Add(user);

                await _context.SaveChangesAsync(cancellationToken);

                return movie;
            }

        }

    }
}
