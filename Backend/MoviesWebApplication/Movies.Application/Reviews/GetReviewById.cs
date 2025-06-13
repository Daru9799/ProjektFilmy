using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Movies.Application.Reviews
{
    public class GetReviewById
    {
        public class Query : IRequest<ReviewDto>
        {
            public Guid Id { get; set; }
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
                var review = await _context.Reviews
                    .Include(r => r.User)
                    .Include(r => r.Movie)
                    .FirstOrDefaultAsync(r => r.ReviewId == request.Id, cancellationToken);

                if (review == null)
                {
                    return null;
                }

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