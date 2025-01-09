using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Reviews
{
    public class ReviewsList
    {
        //Lista obiektów typu recenzje
        public class Query : IRequest<PagedResponse<ReviewDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; }
        }
        public class Handler : IRequestHandler<Query, PagedResponse<ReviewDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<ReviewDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Review> query = _context.Reviews
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

                var reviewDtos = reviews.Select(r => new ReviewDto
                {
                    ReviewId = r.ReviewId,
                    Comment = r.Comment,
                    Rating = r.Rating,
                    Date = r.Date,
                    Username = r.User.UserName,
                    UserId = r.User.Id,
                    MovieTitle = r.Movie.Title,
                    MovieId = r.Movie.MovieId,
                    IsCritic = r.User.UserRole == User.Role.Critic
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
