using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.MovieCollectionReviews
{
    public class EditMovieCollectionReview
    {
        public class EditMovieCollectionReviewCommand : IRequest<MovieCollectionReview>
        {
            public Guid ReviewId { get; set; }
            public float? Rating { get; set; }
            public string Comment { get; set; }
            public bool? Spoilers { get; set; }
        }

        public class Handler : IRequestHandler<EditMovieCollectionReviewCommand, MovieCollectionReview>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollectionReview> Handle(EditMovieCollectionReviewCommand request, CancellationToken cancellationToken)
            {
                var review = await _context.MovieCollectionReviews
                    .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.ReviewId, cancellationToken);

                if (review == null)
                {
                    return null;
                }

                if (request.Rating.HasValue)
                {
                    review.Rating = request.Rating.Value;
                }

                if (!string.IsNullOrEmpty(request.Comment))
                {
                    review.Comment = request.Comment;
                }

                if (request.Spoilers.HasValue)
                {
                    review.Spoilers = request.Spoilers.Value;
                }

                await _context.SaveChangesAsync(cancellationToken);

                return review;
            }
        }
    }
}
