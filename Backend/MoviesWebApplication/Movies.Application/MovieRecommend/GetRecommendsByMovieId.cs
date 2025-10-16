using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using static Movies.Application.MovieRecommend.CreateUserLikeRecommend;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.MovieRecommend
{
    public class GetRecommendsByMovieId
    {
        public class GetRecommendsByMovieIdCommand : IRequest<PagedResponse<MovieRecommendDto>>
        {
            public Guid MovieId { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }
        public class Handler : IRequestHandler<GetRecommendsByMovieIdCommand, PagedResponse<MovieRecommendDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<PagedResponse<MovieRecommendDto>> Handle(GetRecommendsByMovieIdCommand request, CancellationToken cancellationToken)
            {
                var query = _context.MovieRecommendations
                    .Include(r => r.LikedByUsers)
                    .Where(r => r.MovieId == request.MovieId)
                    .OrderByDescending(r => r.LikesCounter);

                var recommends = await query
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
                var recommendsDtos = recommends.Select(r =>
                {
                    bool isLiking = !string.IsNullOrEmpty(tokenUserId) && (r.LikedByUsers.FirstOrDefault(u => u.Id == tokenUserId) != null);
                    return new MovieRecommendDto
                    {
                        RecommendationId = r.RecommendationId,
                        LikesCounter = r.LikesCounter,
                        RecommendedMovieId = r.RecommendedMovieId,
                        IsLiking = isLiking
                    };
                }).ToList();

                if(recommendsDtos == null || !recommendsDtos.Any())
                {
                    throw new NotFoundException("Nie znaleziono rekomendacji.");
                }

                return new PagedResponse<MovieRecommendDto>
                {
                    Data = recommendsDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
