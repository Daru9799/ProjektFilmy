using MediatR;
using Microsoft.AspNetCore.Http;
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
using Movies.Application.Movies;

namespace Movies.Application.MovieCollectionReviews
{
    public class GetMCReviewByUserIdAndMCId
    {
        public class Query : IRequest<MovieCollectionReviewDto>
        {
            public string UserId { get; set; }
            public Guid MovieCollectionId { get; set; }
        }

        public class Handler : IRequestHandler<Query, MovieCollectionReviewDto>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<MovieCollectionReviewDto> Handle(Query request, CancellationToken cancellationToken)
            {
                // Pobranie jednej recenzji na podstawie UserName i MovieId
                var review = await _context.Users
                    .Where(u => u.Id == request.UserId)
                    .SelectMany(u => u.MovieCollectionReviews)
                    .Include(r => r.User)
                    .Include(r => r.MovieCollection)
                    .FirstOrDefaultAsync(r => r.MovieCollection.MovieCollectionId == request.MovieCollectionId, cancellationToken);

                //Pobieranie tokena JWT z nagłówka
                var userClaims = _httpContextAccessor.HttpContext.User;
                var tokenUserId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                bool isOwner = false;
                if (tokenUserId != null && tokenUserId == review.User.Id.ToString())
                {
                    isOwner = true;
                }

                // Mapowanie na ReviewDto
                return new MovieCollectionReviewDto
                { 
                    MovieCollectionReviewId = review.MovieCollectionReviewId,
                    Comment = review.Comment,
                    Rating = review.Rating,
                    Date = review.Date,
                    Username = review.User.UserName,
                    UserId = review.User.Id,
                    MovieCollectionId = review.MovieCollection.MovieCollectionId,
                    IsCritic = review.User.UserRole == User.Role.Critic,
                    IsOwner = isOwner //Sprawdzenie właściciela
                };
            }
        }
    }
}
