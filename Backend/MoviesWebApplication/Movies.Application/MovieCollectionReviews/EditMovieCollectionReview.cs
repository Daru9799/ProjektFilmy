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
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollectionReview> Handle(EditMovieCollectionReviewCommand request, CancellationToken cancellationToken)
            {
                //Sprawdzenie czy user jest zalogowany
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                }

                var review = await _context.MovieCollectionReviews
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.ReviewId, cancellationToken);

                if (review == null)
                {
                    return null;
                }

                if (review.User == null || review.User.Id != currentUserId)
                {
                    throw new UnauthorizedAccessException("Nie masz uprawnień do edycji tej recenzji. Nie jesteś właścicielem tej recenzji.");
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
