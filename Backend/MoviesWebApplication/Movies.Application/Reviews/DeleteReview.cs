using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;


namespace Movies.Application.Reviews
{
    public class DeleteReview : IRequest<Review>
    {
        public Guid ReviewId { get; set; }

        public DeleteReview(Guid reviewId)
        {
            ReviewId = reviewId;
        }
    }

    public class DeleteReviewCommandHandler : IRequestHandler<DeleteReview, Review>
    {
        private readonly DataContext _context;

        public DeleteReviewCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Review> Handle(DeleteReview request, CancellationToken cancellationToken)
        {
            // Pobranie recenzji z bazy
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ReviewId == request.ReviewId, cancellationToken);

            if (review == null)
            {
                return null;
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync(cancellationToken); 

            return review;
        }
    }
}
