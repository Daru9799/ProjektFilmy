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
    public class ReviewsByUserId
    {
        public class Query : IRequest<List<ReviewDto>>
        {
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ReviewDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<ReviewDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var reviews = await _context.Users
                    .Where(m => m.Id == request.UserId)
                    .SelectMany(m => m.Reviews)
                    .Select(r => new ReviewDto
                    {
                        ReviewId = r.ReviewId,
                        Comment = r.Comment,
                        Rating = r.Rating,
                        Username = r.User.UserName,
                        UserId = r.User.Id,
                        MovieTitle = r.Movie.Title,
                        MovieId = r.Movie.MovieId
                    })
                    .ToListAsync(cancellationToken);
                return reviews;
            }
        }
    }
}
