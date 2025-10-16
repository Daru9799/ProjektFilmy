using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;


namespace Movies.Application.Replies
{
    public class GetRepliesByReviewId
    {
        public class Query : IRequest<PagedResponse<ReplyDto>>
        {
            public Guid ReviewId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }
        public class Handler : IRequestHandler<Query, PagedResponse<ReplyDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<PagedResponse<ReplyDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Replies
                    .Where(r => r.Review.ReviewId == request.ReviewId)
                    .Include(r => r.User)
                    .Include(r => r.Review)
                    .OrderByDescending(r => r.Date); //Sortowanie po dacie

                if (!await query.AnyAsync(cancellationToken))
                {
                    return new PagedResponse<ReplyDto>
                    {
                        Data = new List<ReplyDto>(),
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
                    return new ReplyDto
                    {
                        ReplyId = r.ReplyId,
                        Comment = r.Comment,
                        Date = r.Date,
                        Username = r.User.UserName,
                        UserId = r.User.Id,
                        ReviewId = r.Review.ReviewId,
                        IsOwner = isOwner
                    };
                }).ToList();

                if (replyDtos == null || !replyDtos.Any())
                {
                    throw new NotFoundException("Nie znaleziono komentarzy.");
                }

                return new PagedResponse<ReplyDto>
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
