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
    public class DeleteMovieCollectionReviewReply : IRequest<MovieCollectionReviewReply>
    {
        public Guid ReplyId { get; set; }

        public DeleteMovieCollectionReviewReply(Guid replyId)
        {
            ReplyId = replyId;
        }
    }

    public class DeleteMovieCollectionReviewReplyHandler : IRequestHandler<DeleteMovieCollectionReviewReply, MovieCollectionReviewReply>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteMovieCollectionReviewReplyHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<MovieCollectionReviewReply> Handle(DeleteMovieCollectionReviewReply request, CancellationToken cancellationToken)
        {
            //Sprawdzenie czy user jest zalogowany
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentUserId))
            {
                throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany.");
            }

            var currentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

            //Pobranie komentarza z bazy
            var reply = await _context.MovieCollectionReviewReplies
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReplyId == request.ReplyId, cancellationToken);

            if (reply == null)
            {
                return null;
            }

            //Sprawdzenie czy user jest właścicielem bądź moderatorem
            bool isOwner = reply.User != null && reply.User.Id == currentUserId;
            bool isMod = currentUser.UserRole == User.Role.Mod;

            if (!isOwner && !isMod)
            {
                throw new UnauthorizedAccessException("Nie masz uprawnień do usunięcia tego komentarza.");
            }

            //if (reply.User == null || reply.User.Id != currentUserId)
            //{
            //    throw new UnauthorizedAccessException("Nie masz uprawnień do usunięcia tego komentarza. Nie jesteś właścicielem tego komentarza.");
            //}

            _context.MovieCollectionReviewReplies.Remove(reply);
            await _context.SaveChangesAsync(cancellationToken);

            return reply;
        }
    }
}
