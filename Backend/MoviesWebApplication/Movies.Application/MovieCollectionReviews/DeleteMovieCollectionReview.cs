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
    public class DeleteMovieCollectionReview : IRequest<MovieCollectionReview>
    {
        public Guid ReviewId { get; set; }

        public DeleteMovieCollectionReview(Guid reviewId)
        {
            ReviewId = reviewId;
        }
    }

    public class DeleteCollectionReviewHandler : IRequestHandler<DeleteMovieCollectionReview, MovieCollectionReview>
    {
        private readonly DataContext _context;

        public DeleteCollectionReviewHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<MovieCollectionReview> Handle(DeleteMovieCollectionReview request, CancellationToken cancellationToken)
        {
            //Pobranie recenzji kolekcji z bazy
            var review = await _context.MovieCollectionReviews
                .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.ReviewId, cancellationToken);

            if (review == null)
            {
                return null;
            }

            _context.MovieCollectionReviews.Remove(review);
            await _context.SaveChangesAsync(cancellationToken);

            return review;
        }
    }
}
