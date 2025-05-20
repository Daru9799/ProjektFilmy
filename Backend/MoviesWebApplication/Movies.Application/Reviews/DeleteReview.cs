using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;


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
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteReviewCommandHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Review> Handle(DeleteReview request, CancellationToken cancellationToken)
        {
            //Sprawdzenie czy user jest zalogowany
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentUserId))
            {
                throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
            }

            //Pobranie recenzji z bazy
            var review = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewId == request.ReviewId, cancellationToken);

            if (review == null)
            {
                return null;
            }

            if (review.User == null || review.User.Id != currentUserId)
            {
                throw new UnauthorizedAccessException("Nie masz uprawnień do usunięcia tej recenzji. Nie jesteś właścicielem tej recenzji.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync(cancellationToken); 

            return review;
        }
    }
}
