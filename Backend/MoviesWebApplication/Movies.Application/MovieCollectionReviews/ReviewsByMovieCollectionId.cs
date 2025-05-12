using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Domain;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollectionReviews
{
    public class ReviewsByMovieCollectionId
    {
        public class Query : IRequest<PagedResponse<MovieCollectionReviewDto>>
        {
            public Guid MovieCollectionId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<MovieCollectionReviewDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<PagedResponse<MovieCollectionReviewDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<MovieCollectionReview> query = _context.MovieCollectionReviews
                    .Where(r => r.MovieCollection.MovieCollectionId == request.MovieCollectionId)
                    .Include(r => r.User)
                    .Include(r => r.MovieCollection);

                query = (request.OrderBy?.ToLower(), request.SortDirection?.ToLower()) switch
                {
                    ("year", "desc") => query.OrderByDescending(r => r.Date),
                    ("year", "asc") => query.OrderBy(r => r.Date),
                    ("rating", "asc") => query.OrderBy(r => r.Rating),
                    ("rating", "desc") => query.OrderByDescending(r => r.Rating),
                    _ => query.OrderBy(r => r.MovieCollectionReviewId) //Domyślne sortowanie po id
                };

                //Paginacja
                var reviews = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                int totalItems = await query.CountAsync(cancellationToken);

                //Pobieranie tokena JWT z nagłówka
                var userClaims = _httpContextAccessor.HttpContext.User;
                var tokenUserId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (tokenUserId == null)
                {
                    tokenUserId = string.Empty;
                }

                var reviewDtos = reviews.Select(r =>
                {
                    bool isOwner = r.User.Id.ToString() == tokenUserId;
                    return new MovieCollectionReviewDto
                    {
                        MovieCollectionReviewId = r.MovieCollectionReviewId,
                        Comment = r.Comment,
                        Rating = r.Rating,
                        Date = r.Date,
                        Username = r.User.UserName,
                        UserId = r.User.Id,
                        MovieCollectionId = r.MovieCollection.MovieCollectionId,
                        Spoilers = r.Spoilers,
                        IsCritic = r.User.UserRole == User.Role.Critic,
                        IsOwner = isOwner //Sprawdzenie właściciela
                    };
                }).ToList();

                return new PagedResponse<MovieCollectionReviewDto>
                {
                    Data = reviewDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
