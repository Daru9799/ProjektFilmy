using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Users
{
    public class AddFollowToMovie
    {
        public class AddFollowToMovieCommand : IRequest<Movie>
        {
            public Guid MovieId { get; set; }
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<AddFollowToMovieCommand, Movie>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Movie> Handle(AddFollowToMovieCommand request, CancellationToken cancellationToken)
            {

                var movie = await _context.Movies
                    .Include(m => m.Followers)
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);
                if (movie == null)
                    throw new Exception("Nie znaleziono filmu.");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null) throw new Exception("Nie znaleziono użytkownika.");

                if (movie.Followers.Any(u => u.Id == user.Id))
                    throw new InvalidOperationException("Użytkownik już obserwuje ten film");

                movie.Followers.Add(user);

                await _context.SaveChangesAsync(cancellationToken);

                return movie;
            }

        }

    }
}
