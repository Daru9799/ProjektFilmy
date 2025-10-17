using MediatR;
using Movies.Domain.DTOs;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using static Movies.Domain.Entities.MovieCollection;
using static Movies.Domain.Entities.MoviePerson;
using Microsoft.AspNetCore.Http;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Users
{
    public class UserStatisticsByUserName
    {
        public class Query : IRequest<StatisticsDto>
        {
            public string userName { get; set; }
        }

        public class Handler : IRequestHandler<Query, StatisticsDto>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<StatisticsDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUserName = _httpContextAccessor.HttpContext?.User?.Identity?.Name;

                if (string.IsNullOrEmpty(currentUserName))
                {
                    throw new UnauthorizedException("Nie jesteś zalogowany.");
                }
                else if (!string.Equals(currentUserName, request.userName, StringComparison.OrdinalIgnoreCase))
                {
                    throw new ForbidenException("Nie masz dostępu do tej strony");
                }

                var user = await _context.Users
                    .Include(u => u.Reviews)
                    .FirstOrDefaultAsync(u => u.UserName == request.userName, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException($"Użytkownik o nazwie '{request.userName}' nie zostal odnaleziony.");
                }

                var watchedMovieIds = await _context.MovieCollections
                    .Where(mc => mc.User.UserName == request.userName && mc.Type == CollectionType.Watched)
                    .SelectMany(mc => mc.Movies.Select(mmc => mmc.MovieId))
                    .ToListAsync(cancellationToken);

                var plannedMovieCount = await _context.MovieCollections
                    .Where(mc => mc.User.UserName == request.userName.ToString() && mc.Type == CollectionType.Planned)
                    .SelectMany(mc => mc.Movies)
                    .CountAsync(cancellationToken);

                var watchedMovies = await _context.Movies
                    .Where(m => watchedMovieIds.Contains(m.MovieId))
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .Include(m => m.MoviePerson)
                        .ThenInclude(mp => mp.Person) 
                    .ToListAsync(cancellationToken);


                var reviews = await _context.Reviews
                    .Where(r => r.User.UserName == request.userName)
                    .ToListAsync(cancellationToken);

                var ratingDistribution = reviews
                   .GroupBy(r => r.Rating)
                   .Select(g => new RatingCountDto
                   {
                       Rating = g.Key,
                       Count = g.Count()
                   })
                   .OrderByDescending(r => r.Rating)
                   .ToList();

                var favoriteActor = watchedMovies
                    .SelectMany(m => m.MoviePerson.Where(mp => mp.Role == PersonRole.Actor && mp.Person != null))
                    .GroupBy(mp => mp.Person)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new PersonDto
                    {
                        PersonId = g.Key.PersonId,
                        FirstName = g.Key.FirstName,
                        LastName = g.Key.LastName,
                        PhotoUrl = g.Key.PhotoUrl
                    })
                    .FirstOrDefault(); 

                if (favoriteActor == null)
                {
                    Console.WriteLine("Brak danych dla ulubionego aktora.");
                }

                var favoriteDirector = watchedMovies
                    .SelectMany(m => m.MoviePerson.Where(mp => mp.Role == PersonRole.Director && mp.Person != null))
                    .GroupBy(mp => mp.Person)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new PersonDto
                    {
                        PersonId = g.Key.PersonId,
                        FirstName = g.Key.FirstName,
                        LastName = g.Key.LastName,
                        PhotoUrl=g.Key.PhotoUrl
                    })
                    .FirstOrDefault();  // Zwróci pierwszego reżysera, jeśli istnieje

                if (favoriteDirector == null)
                {
                    Console.WriteLine("Brak danych dla ulubionego reżysera.");
                }

                var ratings = reviews
                    .GroupBy(r => r.Rating)
                    .ToDictionary(g => g.Key, g => g.Count());

                var watchedMoviesByCategory = watchedMovies
                    .SelectMany(m => m.Categories)
                    .GroupBy(c => c)
                    .OrderBy(g => g.Key.Name)
                    .Select(g => new CategoryCountDto
                    {
                        Category = new CategoryDto { CategoryId = g.Key.CategoryId, Name = g.Key.Name },
                        Count = g.Count()
                    })
                    .ToList();

                var watchedMoviesByCountry = watchedMovies
                    .SelectMany(m => m.Countries)
                    .GroupBy(c => c)
                    .OrderBy(g => g.Key.Name)
                    .Select(g => new CountryCountDto
                    {
                        Country = new CountryDto { CountryId = g.Key.CountryId, Name = g.Key.Name },
                        Count = g.Count()
                    })
                    .ToList();

                var totalDuration = watchedMovies.Sum(m => m.Duration);

                return new StatisticsDto
                {
                    NumberOfPlannedMovies = plannedMovieCount,
                    NumberOfWathcedMovies = watchedMovies.Count,
                    HoursOfWathcedMovies = Math.Round((double)totalDuration / 60, 1),
                    NumberOfReviews = reviews.Count,
                    FavoriteActor = favoriteActor,
                    FavoriteDirector = favoriteDirector,
                    WatchedMoviesByCategory = watchedMoviesByCategory,
                    WatchedMoviesByCountry = watchedMoviesByCountry,
                    RatingDistribution = ratingDistribution
                };
            }
        }
    }
}
