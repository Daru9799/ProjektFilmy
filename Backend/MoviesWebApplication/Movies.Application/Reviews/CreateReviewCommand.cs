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
    public class CreateReviewCommand
    {
        public class Command : IRequest<Review>
        {
            public float Rating { get; set; }
            public string Comment { get; set; }
            public DateTime Date { get; set; }
            public Guid MovieId { get; set; }
            public string UserId { get; set; }  // Id użytkownika jako string
        }

        public class Handler : IRequestHandler<Command, Review>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Review> Handle(Command request, CancellationToken cancellationToken)
            {
                //Sprawdzanie istnienia filmu
                var movie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);

                if (movie == null)
                {
                    throw new ValidationException($"Nie znaleziono filmu o ID: {request.MovieId}");
                }

                //Sprawdzanie istnienia użytkownika
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null)
                {
                    throw new ValidationException($"Nie znaleziono użytkownika o ID: {request.UserId}");
                }

                //Tworzenie nowej recenzji
                var review = new Review
                {
                    ReviewId = Guid.NewGuid(),
                    Rating = request.Rating,
                    Comment = request.Comment,
                    Date = request.Date,
                    Movie = movie,
                    User = user
                };

                //Dodanie recenzji do bazy danych
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync(cancellationToken);

                return review;
            }
        }
    }
}
