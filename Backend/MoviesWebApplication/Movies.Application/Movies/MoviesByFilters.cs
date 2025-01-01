using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Movies
{
    public class MoviesByFilters
    {
        public class Query : IRequest<List<MovieDto>>
        {
            public List<string> CategoryNames { get; set; }
            public List<string> CountryNames { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<MovieDto>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<MovieDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var moviesQuery = _context.Movies.AsQueryable();

                //Filtrowanie po kategoriach
                if (request.CategoryNames != null && request.CategoryNames.Any())
                {
                    moviesQuery = moviesQuery.Where(m => m.Categories.Any(c => request.CategoryNames.Contains(c.Name)));
                }

                //Filtrowanie po krajach
                if (request.CountryNames != null && request.CountryNames.Any())
                {
                    moviesQuery = moviesQuery.Where(m => m.Countries.Any(c => request.CountryNames.Contains(c.Name)));
                }

                //Pobieranie danych z bazy
                var movies = await moviesQuery
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .ToListAsync(cancellationToken);

                //Zwrócenie odpowiednich filmów
                return movies.Select(movie => new MovieDto
                {
                    MovieId = movie.MovieId,
                    Title = movie.Title,
                    ReleaseDate = movie.ReleaseDate,
                    PosterUrl = movie.PosterUrl,
                    Description = movie.Description,
                    Duration = movie.Duration,
                    ReviewsNumber = movie.Reviews.Count,
                    ScoresNumber = movie.Reviews.Count(r => r.Rating > 0),
                    AverageScore = movie.Reviews.Any(r => r.Rating > 0) ? movie.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating) : 0,
                    Categories = movie.Categories.Select(c => new CategoryDto
                    {
                        CategoryId = c.CategoryId,
                        CategoryName = c.Name
                    }).ToList(),
                    Countries = movie.Countries.Select(c => new CountryDto
                    {
                        CountryId = c.CountryId,
                        CountryName = c.Name
                    }).ToList()
                }).ToList();
            }
        }
    }
}
