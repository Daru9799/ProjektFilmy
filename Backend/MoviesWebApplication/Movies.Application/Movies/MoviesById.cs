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
    public class MoviesById
    {
        //Zapytanie przyjmuje ID filmu
        public class Query : IRequest<MovieDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, MovieDto>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<MovieDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //Pobierz film z bazy na podstawie ID
                var movie = await _context.Movies
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .FirstOrDefaultAsync(m => m.MovieId == request.Id, cancellationToken);

                return new MovieDto
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
                };
            }
        }
    }
}
