using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Domain.DTOs;

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
                    .Include(m => m.MoviePerson)
                        .ThenInclude(mp => mp.Person)
                    .Where(m => m.MoviePerson.Any(mp => mp.Person.PersonId == request.ActorId && mp.Role == MoviePerson.PersonRole.Actor))
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
                    Directors = movie.MoviePerson.Where(mp => mp.Role == MoviePerson.PersonRole.Director).Select(mp => new PersonDto
                    {
                        PersonId = mp.Person.PersonId,
                        FirstName = mp.Person.FirstName,
                        LastName = mp.Person.LastName,
                        Bio = mp.Person.Bio,
                        BirthDate = mp.Person.BirthDate,
                        PhotoUrl = mp.Person.PhotoUrl
                    }).ToList()
                }).ToList();
            }
        }
    }
}
