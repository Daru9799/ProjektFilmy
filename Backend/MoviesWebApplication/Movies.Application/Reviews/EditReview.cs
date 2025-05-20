using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Movies.Application.Reviews
{
    public class EditReview 
    {
        public class EditReviewCommand : IRequest<Review>
        {
            public Guid ReviewId { get; set; }
            //Edycja tylko dla ocen i komentarzy
            public float? Rating { get; set; } 
            public string Comment { get; set; } 
        }

        public class Handler : IRequestHandler<EditReviewCommand, Review>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Review> Handle(EditReviewCommand request, CancellationToken cancellationToken)
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
                    throw new UnauthorizedAccessException("Nie masz uprawnień do edycji tej recenzji. Nie jesteś właścicielem tej recenzji.");
                }

                //Aktualizacja pól
                if (request.Rating.HasValue)
                {
                    review.Rating = request.Rating.Value;
                }

                if (!string.IsNullOrEmpty(request.Comment))
                {
                    review.Comment = request.Comment;
                }

                //Zapis zmian w bazie danych
                await _context.SaveChangesAsync(cancellationToken);

                return review;
            }
        }
    }
}
