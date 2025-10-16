using MediatR;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.MovieCollectionReviews
{
    public class GetCollectionReviewById
    {
        public class Query : IRequest<MovieCollectionReviewDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, MovieCollectionReviewDto>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollectionReviewDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var review = await _context.MovieCollectionReviews
                    .Include(r => r.User)
                    .Include(r => r.MovieCollection)
                    .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.Id, cancellationToken);

                if (review == null)
                {
                    throw new NotFoundException($"Nie znaleziono recenzji o ID: {request.Id}.");
                }

                return new MovieCollectionReviewDto
                {
                    MovieCollectionReviewId = review.MovieCollectionReviewId,
                    Comment = review.Comment,
                    Rating = review.Rating,
                    Date = review.Date,
                    Username = review.User.UserName,
                    UserId = review.User.Id,
                    Spoilers = review.Spoilers,
                    MovieCollectionId = review.MovieCollection.MovieCollectionId,
                    IsCritic = review.User.UserRole == User.Role.Critic
                };
            }
        }
    }
}
