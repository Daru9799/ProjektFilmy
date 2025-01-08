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
    public class MoviesByActorId
    {
        public class Query : IRequest<List<MovieDto>>
        {
            public Guid ActorId { get; set; }
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
                //Pobiera filmy na podstawie ID aktora
                var movies = await _context.Movies
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .Include(m => m.Directors)
                    .Include(m => m.Actors)
                    .Where(m => m.Actors.Any(a => a.ActorId == request.ActorId))
                    .ToListAsync(cancellationToken);

                if (!movies.Any())
                {
                    return new List<MovieDto>();
                }

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
                        Name = c.Name
                    }).ToList(),
                    Countries = movie.Countries.Select(c => new CountryDto
                    {
                        CountryId = c.CountryId,
                        Name = c.Name
                    }).ToList(),
                    Directors = movie.Directors.Select(d => new DirectorDto
                    {
                        DirectorId = d.DirectorId,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        Bio = d.Bio,
                        BirthDate = d.BirthDate,
                        PhotoUrl = d.PhotoUrl
                    }).ToList()
                }).ToList();
            }
        }
    }
}
