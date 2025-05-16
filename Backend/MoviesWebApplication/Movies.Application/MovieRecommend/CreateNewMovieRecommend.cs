using MediatR;
using Movies.Application.Categories;
using Movies.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Movies.Infrastructure;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations;

namespace Movies.Application.MovieRecommend
{
    public class CreateNewMovieRecommend
    {
        public class CreateNewMovieRecommendCommend : IRequest<Domain.Entities.MovieRecommendation>
        {
            public Guid MovieId { get; set; }
            public Guid RecommendedMovieId { get; set; }

        }
        public class Handler : IRequestHandler<CreateNewMovieRecommendCommend, Domain.Entities.MovieRecommendation>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<Domain.Entities.MovieRecommendation> Handle(CreateNewMovieRecommendCommend request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                }

                var movie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);
                if (movie == null)
                    throw new ValidationException("Nie znaleziono filmu o ID: "+request.MovieId);

                var recommendMovie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.RecommendedMovieId, cancellationToken);
                if (recommendMovie == null)
                    throw new ValidationException("Nie znaleziono rekomendowanego filmu o ID: " + request.RecommendedMovieId);

                var alredyExistsRecommend = await _context.MovieRecommendations
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId && m.RecommendedMovieId == request.RecommendedMovieId, cancellationToken);

                // Jeśli istnieje już rekomendacja
                if (alredyExistsRecommend != null)
                {
                    throw new InvalidOperationException("Nie można stworzyć rekomendacji, ponieważ rekomendacja już istnieje.");
                }

                var recommendation = new Domain.Entities.MovieRecommendation
                {
                    RecommendationId = Guid.NewGuid(),
                    LikesCounter = 0,
                    Movie = movie,
                    RecommendedMovie = recommendMovie,
                    MovieId = request.MovieId,
                    RecommendedMovieId = request.RecommendedMovieId,
                    LikedByUsers = new List<User>()
                };

/*
                // Dodaj rekomendację do listy filmu źródłowego
                if (movie.Recommendations == null)
                    movie.Recommendations = new List<Domain.Entities.MovieRecommendation>();
                movie.Recommendations.Add(recommendation);

                // Dodaj rekomendację do listy filmu polecanego
                if (recommendMovie.RecommendedBy == null)
                    recommendMovie.RecommendedBy = new List<Domain.Entities.MovieRecommendation>();
                recommendMovie.RecommendedBy.Add(recommendation);
*/
                _context.MovieRecommendations.Add(recommendation);

                await _context.SaveChangesAsync(cancellationToken);

                return recommendation;
            }
        }
    }
}
