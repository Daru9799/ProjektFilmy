using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static Movies.Application.MovieRecommend.CreateNewMovieRecommend;

namespace Movies.Application.MovieRecommend
{
    public class CreateUserLikeRecommend
    {
        public class CreateUserLikeRecommendCommand : IRequest<Domain.Entities.MovieRecommendation>
        {
            public Guid RecommendationId { get; set; }
        }
        public class Handler : IRequestHandler<CreateUserLikeRecommendCommand, Domain.Entities.MovieRecommendation>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<Domain.Entities.MovieRecommendation> Handle(CreateUserLikeRecommendCommand request, CancellationToken cancellationToken)
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

                if (recommedation.LikedByUsers.Any(u => u.Id == currentUserId))
                    throw new InvalidOperationException("Użytkownik już polubił tą rekomendacje");


                recommedation.LikedByUsers.Add(user);
                recommedation.LikesCounter = recommedation.LikedByUsers.Count();

                await _context.SaveChangesAsync(cancellationToken);

                return recommedation;
            }
        }
    }
}
