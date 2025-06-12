using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

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
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteCollectionReviewHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<MovieCollectionReview> Handle(DeleteMovieCollectionReview request, CancellationToken cancellationToken)
        {
            //Sprawdzenie czy user jest zalogowany
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentUserId))
            {
                throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
            }

            var currentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

            //Pobranie recenzji kolekcji z bazy
            var review = await _context.MovieCollectionReviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.ReviewId, cancellationToken);

            if (review == null)
            {
                return null;
            }

            //Sprawdzenie czy user jest właścicielem bądź moderatorem
            bool isOwner = review.User != null && review.User.Id == currentUserId;
            bool isMod = currentUser.UserRole == User.Role.Mod;

            if (!isOwner && !isMod)
            {
                throw new UnauthorizedAccessException("Nie masz uprawnień do usunięcia tej recenzji.");
            }

            _context.MovieCollectionReviews.Remove(review);
            await _context.SaveChangesAsync(cancellationToken);

            return review;
        }
    }
}
