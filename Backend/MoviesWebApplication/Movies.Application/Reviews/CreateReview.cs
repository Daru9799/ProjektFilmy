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

namespace Movies.Application.Reviews
{
    public class CreateReview
    {
        public class CreateReviewCommand : IRequest<Review>
        {
            public float Rating { get; set; }
            public string Comment { get; set; }
            public DateTime Date { get; set; }
            public Guid MovieId { get; set; }
            public string UserName { get; set; }  // Nazwa użytkownika

            public class Handler : IRequestHandler<CreateReviewCommand, Review>
            {
                private readonly DataContext _context;

                public Handler(DataContext context)
                {
                    _context = context;
                }

                public async Task<Review> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
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
                        .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                    if (user == null)
                    {
                        throw new ValidationException($"Nie znaleziono użytkownika o ID: {request.UserName}");
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
}
