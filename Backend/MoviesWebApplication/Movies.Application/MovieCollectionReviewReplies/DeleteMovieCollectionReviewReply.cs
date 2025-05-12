using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

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

        public DeleteMovieCollectionReviewReplyHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<MovieCollectionReviewReply> Handle(DeleteMovieCollectionReviewReply request, CancellationToken cancellationToken)
        {
            //Pobranie komentarza z bazy
            var reply = await _context.MovieCollectionReviewReplies
                .FirstOrDefaultAsync(r => r.ReplyId == request.ReplyId, cancellationToken);

            if (reply == null)
            {
                return null;
            }

            _context.MovieCollectionReviewReplies.Remove(reply);
            await _context.SaveChangesAsync(cancellationToken);

            return reply;
        }
    }
}
