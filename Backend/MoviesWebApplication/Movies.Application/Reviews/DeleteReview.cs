using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Application._Common.Exceptions;


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
                throw new UnauthorizedException("Użytkownik nie jest zalogowany");
            }

            var currentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

            //Pobranie recenzji z bazy
            var review = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewId == request.ReviewId, cancellationToken);

            if (review == null)
            {
                throw new NotFoundException($"Nie znaleziono recenzji o ID: {request.ReviewId}");
            }

            //Sprawdzenie czy user jest właścicielem bądź moderatorem
            bool isOwner = review.User != null && review.User.Id == currentUserId;
            bool isMod = currentUser.UserRole == User.Role.Mod;

            if (!isOwner && !isMod)
            {
                throw new ForbidenException("Nie masz uprawnień do usunięcia tej recenzji.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync(cancellationToken); 

            return review;
        }
    }
}
