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
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Application._Common.Exceptions;

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
                private readonly IHttpContextAccessor _httpContextAccessor;

                public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
                {
                    _context = context;
                    _httpContextAccessor = httpContextAccessor;
                }

                public async Task<MovieCollectionReview> Handle(CreateMovieCollectionReviewCommand request, CancellationToken cancellationToken)
                {
                    //Sprawdzenie czy user jest zalogowany
                    var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                    if (string.IsNullOrEmpty(currentUserId))
                    {
                        throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                    }

                    //Sprawdzenie istnienia kolekcji
                    var collection = await _context.MovieCollections
                        .FirstOrDefaultAsync(m => m.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                    if (collection == null)
                    {
                        throw new NotFoundException($"Nie znaleziono kolekcji filmowej o ID: {request.MovieCollectionId}");
                    }

                    //Sprawdzenie istnienia użytkownika
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                    if (user == null)
                    {
                        throw new NotFoundException($"Nie znaleziono użytkownika o nazwie: {request.UserName}");
                    }

                    if (user.Id != currentUserId)
                    {
                        throw new ForbidenException("Nie masz uprawnień do dodania recenzji!");
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
