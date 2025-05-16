using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static Movies.Application.MovieRecommend.CreateUserLikeRecommend;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.MovieRecommendation
{
    public class DeleteUserLikeRecommend
    {
        public class DeleteUserLikeRecommendCommand : IRequest<Domain.Entities.MovieRecommendation>
        {
            public Guid RecommendationId { get; set; }
        }
        public class Handler : IRequestHandler<DeleteUserLikeRecommendCommand, Domain.Entities.MovieRecommendation>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<Domain.Entities.MovieRecommendation> Handle(DeleteUserLikeRecommendCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                }

                var recommedation = await _context.MovieRecommendations
                    .Include(r => r.LikedByUsers)
                    .FirstOrDefaultAsync(r => r.RecommendationId == request.RecommendationId);
                if (recommedation == null)
                    throw new ValidationException("Nie znaleziono rekomendacji.");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);
                if (user == null)
                    throw new ValidationException("Nie znaleziono użytkownika.");

                if (recommedation.LikedByUsers.FirstOrDefault(u => u.Id == currentUserId) == null)
                    throw new InvalidOperationException("Użytkownik nie ma polubionej tej rekomendacji.");


                recommedation.LikedByUsers.Remove(user);
                recommedation.LikesCounter = recommedation.LikedByUsers.Count();

                await _context.SaveChangesAsync(cancellationToken);

                return recommedation;
            }
        }
    }
}
