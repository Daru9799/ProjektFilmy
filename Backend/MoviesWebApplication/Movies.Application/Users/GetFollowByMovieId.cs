using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Users
{
    public class GetFollowByMovieId
    {
        public class Query : IRequest<bool>
        {
            public Guid MovieId { get; set; }

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
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                var movie = await _context.Movies
                    .Include(p => p.Followers)
                    .FirstOrDefaultAsync(p => p.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                {
                    throw new NotFoundException($"Movie o ID {request.MovieId} nie został znaleziony");
                }
                // Sprawdź czy wśród obserwujących jest użytkownik o currentUserId
                return movie.Followers.Any(f => f.Id == currentUserId);

            }
        }
    }
}
