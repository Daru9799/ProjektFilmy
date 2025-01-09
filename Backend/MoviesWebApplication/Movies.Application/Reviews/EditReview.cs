using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

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

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Review> Handle(EditReviewCommand request, CancellationToken cancellationToken)
            {
                // Pobranie recenzji z bazy
                var review = await _context.Reviews
                    .FirstOrDefaultAsync(r => r.ReviewId == request.ReviewId, cancellationToken);

                if (review == null)
                {
                    return null;
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
