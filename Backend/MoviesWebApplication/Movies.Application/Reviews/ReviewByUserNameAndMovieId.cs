﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Domain.Entities;
using Movies.Domain.DTOs;

namespace Movies.Application.Reviews
{
    public class ReviewByUserNameAndMovieId
    {
        public class Query : IRequest<ReviewDto>
        {
            public string UserName { get; set; }
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<Query, ReviewDto>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<ReviewDto> Handle(Query request, CancellationToken cancellationToken)
            {
                // Pobranie jednej recenzji na podstawie UserName i MovieId
                var review = await _context.Users
                    .Where(u => u.UserName == request.UserName)
                    .SelectMany(u => u.Reviews)
                    .Include(r => r.User)
                    .Include(r => r.Movie)
                    .FirstOrDefaultAsync(r => r.Movie.MovieId == request.MovieId, cancellationToken);

                if (review == null)
                {
                    return null;
                }

                //Pobieranie tokena JWT z nagłówka
                var userClaims = _httpContextAccessor.HttpContext.User;
                var tokenUserId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                bool isOwner = false;
                if (tokenUserId != null && tokenUserId == review.User.Id.ToString())
                {
                    isOwner = true;
                }

                // Mapowanie na ReviewDto
                return new ReviewDto
                {
                    ReviewId = review.ReviewId,
                    Comment = review.Comment,
                    Rating = review.Rating,
                    Date = review.Date,
                    Username = review.User.UserName,
                    UserId = review.User.Id,
                    MovieTitle = review.Movie.Title,
                    MovieId = review.Movie.MovieId,
                    IsCritic = review.User.UserRole == User.Role.Critic,
                    IsOwner = isOwner //Sprawdzenie właściciela
                };
            }
        }
    }
}
