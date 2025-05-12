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

namespace Movies.Application.MovieCollectionReviewReplies
{
    public class CreateMovieCollectionReviewReply
    {
        public class CreateMovieCollectionReviewReplyCommand : IRequest<MovieCollectionReviewReply>
        {
            public string Comment { get; set; }
            public DateTime Date { get; set; }
            public Guid MovieCollectionReviewId { get; set; }
            public string UserName { get; set; }

            public class Handler : IRequestHandler<CreateMovieCollectionReviewReplyCommand, MovieCollectionReviewReply>
            {
                private readonly DataContext _context;

                public Handler(DataContext context)
                {
                    _context = context;
                }

                public async Task<MovieCollectionReviewReply> Handle(CreateMovieCollectionReviewReplyCommand request, CancellationToken cancellationToken)
                {
                    //Sprawdzenie istnienia recenzji
                    var review = await _context.MovieCollectionReviews
                        .FirstOrDefaultAsync(r => r.MovieCollectionReviewId == request.MovieCollectionReviewId, cancellationToken);

                    if (review == null)
                    {
                        throw new ValidationException($"Nie znaleziono recenzji o ID: {request.MovieCollectionReviewId}");
                    }

                    //Sprawdzenie istnienia użytkownika
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                    if (user == null)
                    {
                        throw new ValidationException($"Nie znaleziono użytkownika o nazwie: {request.UserName}");
                    }

                    //Tworzenie nowej odpowiedzi
                    var reply = new MovieCollectionReviewReply
                    {
                        ReplyId = Guid.NewGuid(),
                        Comment = request.Comment,
                        Date = request.Date,
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
