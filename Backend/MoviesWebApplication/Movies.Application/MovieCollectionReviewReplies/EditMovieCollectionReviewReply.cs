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

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieCollectionReviewReply> Handle(EditMovieCollectionReviewReplyCommand request, CancellationToken cancellationToken)
            {
                var reply = await _context.MovieCollectionReviewReplies
                    .FirstOrDefaultAsync(r => r.ReplyId == request.ReplyId, cancellationToken);

                if (reply == null)
                {
                    return null;
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
