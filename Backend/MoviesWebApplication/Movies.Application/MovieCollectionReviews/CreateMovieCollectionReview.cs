using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.MovieCollectionReviews
{
    public class CreateMovieCollectionReview
    {
        public class CreateMovieCollectionReviewCommand : IRequest<MovieCollectionReview>
        {
            public float Rating { get; set; }
            public string Comment { get; set; }
            public DateTime Date { get; set; }
            public Guid MovieCollectionId { get; set; }
            public string UserName { get; set; }
            public bool Spoilers { get; set; }

            public class Handler : IRequestHandler<CreateMovieCollectionReviewCommand, MovieCollectionReview>
            {
                private readonly DataContext _context;

                public Handler(DataContext context)
                {
                    _context = context;
                }

                public async Task<MovieCollectionReview> Handle(CreateMovieCollectionReviewCommand request, CancellationToken cancellationToken)
                {
                    //Sprawdzenie istnienia kolekcji
                    var collection = await _context.MovieCollections
                        .FirstOrDefaultAsync(m => m.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                    if (collection == null)
                    {
                        throw new ValidationException($"Nie znaleziono kolekcji filmowej o ID: {request.MovieCollectionId}");
                    }

                    //Sprawdzenie istnienia użytkownika
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                    if (user == null)
                    {
                        throw new ValidationException($"Nie znaleziono użytkownika o nazwie: {request.UserName}");
                    }

                    //Tworzenie nowej recenzji dla listy
                    var review = new MovieCollectionReview
                    {
                        MovieCollectionReviewId = Guid.NewGuid(),
                        Rating = request.Rating,
                        Comment = request.Comment,
                        Date = request.Date,
                        Spoilers = request.Spoilers,
                        MovieCollection = collection,
                        User = user
                    };

                    //Dodanie do bazy
                    _context.MovieCollectionReviews.Add(review);
                    await _context.SaveChangesAsync(cancellationToken);

                    return review;
                }
            }
        }
    }
}
