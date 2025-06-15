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

namespace Movies.Application.MovieCollectionReviewReplies
{
    public class CreateMovieCollectionReviewReply
    {
        public class CreateMovieCollectionReviewReplyCommand : IRequest<MovieCollectionReviewReply>
        {
            public string Comment { get; set; }
            public Guid ReviewId { get; set; }

            public class Handler : IRequestHandler<CreateMovieCollectionReviewReplyCommand, MovieCollectionReviewReply>
            {
                private readonly DataContext _context;
                private readonly IHttpContextAccessor _httpContextAccessor;

                public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
                {
                    _context = context;
                    _httpContextAccessor = httpContextAccessor;
                }

                public async Task<MovieCollectionReviewReply> Handle(CreateMovieCollectionReviewReplyCommand request, CancellationToken cancellationToken)
                {
                    //Sprawdzenie czy user jest zalogowany
                    var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                    if (string.IsNullOrEmpty(currentUserId))
                    {
                        throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                    }

                    //Sprawdzenie istnienia recenzji
                    var review = await _context.MovieCollectionReviews
                        .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.ReviewId, cancellationToken);

                    if (review == null)
                    {
                        throw new ValidationException($"Nie znaleziono recenzji o ID: {request.ReviewId}");
                    }

                    //Sprawdzenie istnienia użytkownika
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                    if (user == null)
                    {
                        throw new ValidationException($"Nie znaleziono użytkownika");
                    }

                    if (user.Id != currentUserId)
                    {
                        throw new UnauthorizedAccessException("Nie masz uprawnień do dodania komentarza!");
                    }

                    //Tworzenie nowej odpowiedzi
                    var reply = new MovieCollectionReviewReply
                    {
                        ReplyId = Guid.NewGuid(),
                        Comment = request.Comment,
                        Date = DateTime.Now,
                        Review = review,
                        User = user
                    };

                    _context.MovieCollectionReviewReplies.Add(reply);
                    await _context.SaveChangesAsync(cancellationToken);

                    return reply;
                }
            }
        }
    }
}
