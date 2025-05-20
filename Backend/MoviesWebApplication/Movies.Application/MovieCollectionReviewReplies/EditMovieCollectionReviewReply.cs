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

namespace Movies.Application.MovieCollectionReviewReplies
{
    public class EditMovieCollectionReviewReply
    {
        public class EditMovieCollectionReviewReplyCommand : IRequest<MovieCollectionReviewReply>
        {
            public Guid ReplyId { get; set; }
            public string Comment { get; set; }
        }

        public class Handler : IRequestHandler<EditMovieCollectionReviewReplyCommand, MovieCollectionReviewReply>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollectionReviewReply> Handle(EditMovieCollectionReviewReplyCommand request, CancellationToken cancellationToken)
            {
                //Sprawdzenie czy user jest zalogowany
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                }

                var reply = await _context.MovieCollectionReviewReplies
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.ReplyId == request.ReplyId, cancellationToken);

                if (reply == null)
                {
                    return null;
                }

                if (reply.User == null || reply.User.Id != currentUserId)
                {
                    throw new UnauthorizedAccessException("Nie masz uprawnień do edycji tego komentarza. Nie jesteś właścicielem tego komentarza.");
                }

                if (!string.IsNullOrEmpty(request.Comment))
                {
                    reply.Comment = request.Comment;
                }

                await _context.SaveChangesAsync(cancellationToken);

                return reply;
            }
        }
    }
}
