using MediatR;
using Movies.Domain.DTOs;
using Movies.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Movies
{
    public class MoviesListByIds
    {
        public class Query : IRequest<List<MovieDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public List<Guid> moviesIds { get; set; }
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
                if (request.moviesIds == null || request.moviesIds.Count == 0)
                {
                    return new List<MovieDto>();
                }

                // Pobierz filmy z bazy danych
                var movies = await _context.Movies
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .Include(m => m.MoviePerson)
                    .ThenInclude(mp => mp.Person)
                    .Where(m => request.moviesIds.Contains(m.MovieId))
                    .Where(m => m.MoviePerson.Any(mp => mp.Role == MoviePerson.PersonRole.Director))
                    .ToListAsync(cancellationToken);

                if (movies == null)
                {
                    throw new NotFoundException($"Nie odnaleziono filmów o podanych id {request.moviesIds}.");
                }

                // Posortuj filmy zgodnie z kolejnością w request.moviesIds
                var orderedMovies = request.moviesIds
                    .Select(id => movies.FirstOrDefault(m => m.MovieId == id))
                    .Where(m => m != null)
                    .ToList();

                // Mapowanie na MovieDto
                var movieDtos = orderedMovies.Select(m => new MovieDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseDate = m.ReleaseDate,
                    PosterUrl = m.PosterUrl,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReviewsNumber = m.Reviews.Count,
                    ScoresNumber = m.Reviews.Count(r => r.Rating > 0),
                    AverageScore = m.Reviews.Any(r => r.Rating > 0) ? m.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating) : 0,
                    Categories = m.Categories.Select(c => new CategoryDto
                    {
                        CategoryId = c.CategoryId,
                        Name = c.Name
                    }).ToList(),
                    Countries = m.Countries.Select(c => new CountryDto
                    {
                        CountryId = c.CountryId,
                        Name = c.Name
                    }).ToList(),
                    Directors = m.MoviePerson
                        .Where(mp => mp.Role == MoviePerson.PersonRole.Director)
                        .Select(mp => new PersonDto
                        {
                            PersonId = mp.Person.PersonId,
                            FirstName = mp.Person.FirstName,
                            LastName = mp.Person.LastName,
                            Bio = mp.Person.Bio,
                            BirthDate = mp.Person.BirthDate,
                            PhotoUrl = mp.Person.PhotoUrl
                        }).ToList()
                }).ToList();

                return movieDtos;
            }
        }
    }
}
