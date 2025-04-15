using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Domain.Entities;
using Movies.Domain.DTOs;

namespace Movies.Application.Reviews
{
    public class ReviewsByMovieId
    {
        public class Query : IRequest<PagedResponse<ReviewDto>>
        {
            public Guid MovieId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<ReviewDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<PagedResponse<ReviewDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Review> query = _context.Movies
                    .Where(m => m.MovieId == request.MovieId)
                    .SelectMany(m => m.Reviews)
                    .Include(r => r.User)
                    .Include(r => r.Movie);

                //Obsługa sortowania
                query = (request.OrderBy?.ToLower(), request.SortDirection?.ToLower()) switch
                {
                    ("year", "desc") => query.OrderByDescending(m => m.Date),
                    ("year", "asc") => query.OrderBy(m => m.Date),
                    ("rating", "asc") => query.OrderBy(m => m.Rating),
                    ("rating", "desc") => query.OrderByDescending(m => m.Rating),
                    _ => query.OrderBy(m => m.ReviewId) //Domyślne sortowanie po id
                };

                //Paginacja
                var reviews = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                //Obliczenie całkowitej liczby elementów
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

                    return new ReviewDto
                    {
                        ReviewId = r.ReviewId,
                        Comment = r.Comment,
                        Rating = r.Rating,
                        Date = r.Date,
                        Username = r.User.UserName,
                        UserId = r.User.Id,
                        MovieTitle = r.Movie.Title,
                        MovieId = r.Movie.MovieId,
                        IsCritic = r.User.UserRole == User.Role.Critic,
                        IsOwner = isOwner //Sprawdzenie właściciela
                    };
                }).ToList();

                return new PagedResponse<ReviewDto>
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
