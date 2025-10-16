using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Movies.Application.MovieRecommend
{
    public class CreateRecommendWithLike
    {
        public class CreateRecommendWithLikeCommand : IRequest<CreateRecommendWithLikeResponse>
        {
            public Guid MovieId { get; set; }
            public Guid RecommendedMovieId { get; set; }
        }

        public class CreateRecommendWithLikeResponse
        {
            public Guid RecommendationId { get; set; }
            public int LikesCounter { get; set; }
            public string Message { get; set; }
        }

        public class Handler : IRequestHandler<CreateRecommendWithLikeCommand, CreateRecommendWithLikeResponse>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<CreateRecommendWithLikeResponse> Handle(CreateRecommendWithLikeCommand request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                // Walidacje
                if (request.MovieId == request.RecommendedMovieId)
                {
                    throw new BadRequestException("Nie można rekomendować filmu tym samym filmem");
                }

                // Sprawdź czy filmy istnieją
                var movie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId, cancellationToken);
                if (movie == null)
                {
                    throw new NotFoundException("Nie znaleziono filmu o ID: " + request.MovieId);
                }

                var recommendMovie = await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.RecommendedMovieId, cancellationToken);

                if (recommendMovie == null)
                {
                    throw new NotFoundException("Nie znaleziono rekomendowanego filmu o ID: " + request.RecommendedMovieId);
                }


                // Sprawdź czy rekomendacja już istnieje
                var alreadyExistsRecommend = await _context.MovieRecommendations
                    .FirstOrDefaultAsync(m => m.MovieId == request.MovieId &&
                                            m.RecommendedMovieId == request.RecommendedMovieId, cancellationToken);

                if (alreadyExistsRecommend != null)
                {
                    throw new ConflictException("Nie można stworzyć rekomendacji, ponieważ rekomendacja już istnieje.");
                }

                // Pobierz użytkownika
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException("Nie znaleziono użytkownika.");
                }

                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    // 1. Tworzenie rekomendacji
                    var recommendation = new Domain.Entities.MovieRecommendation
                    {
                        RecommendationId = Guid.NewGuid(),
                        LikesCounter = 1, // Od razu ustawiamy 1 like
                        Movie = movie,
                        RecommendedMovie = recommendMovie,
                        MovieId = request.MovieId,
                        RecommendedMovieId = request.RecommendedMovieId,
                        LikedByUsers = new List<User> { user } // Od razu dodajemy użytkownika
                    };

                    _context.MovieRecommendations.Add(recommendation);
                    await _context.SaveChangesAsync(cancellationToken);

                    await transaction.CommitAsync();

                    return new CreateRecommendWithLikeResponse
                    {
                        RecommendationId = recommendation.RecommendationId,
                        LikesCounter = recommendation.LikesCounter,
                        Message = "Pomyślnie dodano rekomendację i polubienie."
                    };
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }
    }
}