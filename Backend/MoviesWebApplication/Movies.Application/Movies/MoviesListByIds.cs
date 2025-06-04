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

namespace Movies.Application.Movies
{
    public class MoviesListByIds
    {
        public class Query : IRequest<PagedResponse<MovieDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public List<Guid> moviesIds { get; set; }
        }
        public class Handler : IRequestHandler<Query, PagedResponse<MovieDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<MovieDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Zabezbieczenie się przed brakiem podanych movieId
                if (request.moviesIds == null || request.moviesIds.Count == 0)
                {
                    return new PagedResponse<MovieDto> { Data = new List<MovieDto>() };
                }

                //Zapytanie o filmy
                IQueryable<Movie> query = _context.Movies
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .Include(m => m.MoviePerson)
                    .ThenInclude(mp => mp.Person)
                    .Where(m => request.moviesIds.Contains(m.MovieId)) // <- Tutaj dodane filtrowanie
                    .Where(m => m.MoviePerson.Any(mp => mp.Role == MoviePerson.PersonRole.Director));

                //Paginacja
                var movies = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                //Obliczenie całkowitej liczby elementów
                int totalItems = await query.CountAsync(cancellationToken);

                //Mapowanie na nowy obiekt
                var movieDtos = movies.Select(m => new MovieDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseDate = m.ReleaseDate,
                    PosterUrl = m.PosterUrl,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReviewsNumber = m.Reviews.Count,
                    ScoresNumber = m.Reviews.Count(r => r.Rating > 0), //Tylko z oceną większą od 0 (zakładając że 0 to brak oceny)
                    AverageScore = m.Reviews.Any(r => r.Rating > 0) ? m.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating) : 0,
                    //Zwracanie kategorii (lista)
                    Categories = m.Categories.Select(c => new CategoryDto
                    {
                        CategoryId = c.CategoryId,
                        Name = c.Name
                    }).ToList(),
                    //Zwracanie krajów (lista)
                    Countries = m.Countries.Select(c => new CountryDto
                    {
                        CountryId = c.CountryId,
                        Name = c.Name
                    }).ToList(),
                    //Zwracanie reżyserów (lista)
                    Directors = m.MoviePerson.Where(mp => mp.Role == MoviePerson.PersonRole.Director).Select(mp => new PersonDto
                    {
                        PersonId = mp.Person.PersonId,
                        FirstName = mp.Person.FirstName,
                        LastName = mp.Person.LastName,
                        Bio = mp.Person.Bio,
                        BirthDate = mp.Person.BirthDate,
                        PhotoUrl = mp.Person.PhotoUrl
                    }).ToList()
                }).ToList();

                return new PagedResponse<MovieDto>
                {
                    Data = movieDtos,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
