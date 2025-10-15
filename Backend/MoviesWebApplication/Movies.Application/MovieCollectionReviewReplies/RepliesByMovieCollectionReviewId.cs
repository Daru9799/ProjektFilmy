using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Domain.DTOs;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.MovieCollectionReviewReplies
{
    public class RepliesByMovieCollectionReviewId
    {
        public class Query : IRequest<PagedResponse<MovieCollectionReviewReplyDto>>
        {
            public Guid ReviewId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<MovieCollectionReviewReplyDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<PagedResponse<MovieCollectionReviewReplyDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.MovieCollectionReviewReplies
                    .Where(r => r.Review.MovieCollectionReviewId == request.ReviewId)
                    .Include(r => r.User)
                    .Include(r => r.Review)
                    .OrderByDescending(r => r.Date); //Sortowanie po dacie

                if (!await query.AnyAsync(cancellationToken))
                {
                    return new PagedResponse<MovieCollectionReviewReplyDto>
                    {
                        Data = new List<MovieCollectionReviewReplyDto>(),
                        TotalItems = 0,
                        PageNumber = request.PageNumber,
                        PageSize = request.PageSize
                    };
                }

                var replies = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                int totalItems = await query.CountAsync(cancellationToken);

                var userClaims = _httpContextAccessor.HttpContext.User;
                var tokenUserId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (tokenUserId == null)
                {
                    tokenUserId = string.Empty;
                }

                var replyDtos = replies.Select(r =>
                {
                    bool isOwner = r.User.Id.ToString() == tokenUserId;
                    return new MovieCollectionReviewReplyDto
                    {
                        ReplyId = r.ReplyId,
                        Comment = r.Comment,
                        Date = r.Date,
                        Username = r.User.UserName,
                        UserId = r.User.Id,
                        ReviewId = r.Review.MovieCollectionReviewId,
                        IsOwner = isOwner
                    };
                }).ToList();

                if (replyDtos == null || !replyDtos.Any())
                {
                    throw new NotFoundException($"Nie znaleziono komentarzy dla recenzji listy filmowej o ID '{request.ReviewId}'.");
                }

                return new PagedResponse<MovieCollectionReviewReplyDto>
                {
                    Data = replyDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
