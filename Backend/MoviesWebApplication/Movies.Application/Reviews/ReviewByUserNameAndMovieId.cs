using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Reviews
{
    public class ReviewByUserNameAndMovieId
    {
        public class Query : IRequest<ReviewDto>
        {
            public string UserName { get; set; }
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<Query, ReviewDto>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<ReviewDto> Handle(Query request, CancellationToken cancellationToken)
            {
                // Pobranie jednej recenzji na podstawie UserName i MovieId
                var review = await _context.Users
                    .Where(u => u.UserName == request.UserName)
                    .SelectMany(u => u.Reviews)
                    .Include(r => r.User)
                    .Include(r => r.Movie)
                    .FirstOrDefaultAsync(r => r.Movie.MovieId == request.MovieId, cancellationToken);

                if (review == null)
                {
                    return null;
                }

                // Mapowanie na ReviewDto
                return new ReviewDto
                {
                    ReviewId = review.ReviewId,
                    Comment = review.Comment,
                    Rating = review.Rating,
                    Date = review.Date,
                    Username = review.User.UserName,
                    UserId = review.User.Id,
                    MovieTitle = review.Movie.Title,
                    MovieId = review.Movie.MovieId,
                    IsCritic = review.User.UserRole == User.Role.Critic
                };
            }
        }
    }
}
