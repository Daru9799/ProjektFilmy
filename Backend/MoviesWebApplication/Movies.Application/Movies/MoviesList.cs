using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Infrastructure;

namespace Movies.Application.Movies
{
    public class MoviesList
    {
        //Lista obiektów typu filmy
        public class Query : IRequest<PagedResponse<MovieDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
            public string SortDirection { get; set; } //Kierunek sortowania: "asc" lub "desc"
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
                //Zapytanie o filmy
                IQueryable<Movie> query = _context.Movies
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .Include(m => m.MoviePerson)
                        .ThenInclude(mp => mp.Person)
                    .Where(m => m.MoviePerson.Any(mp => mp.Role == MoviePerson.PersonRole.Director));

                //Obsługa sortowania
                query = (request.OrderBy?.ToLower(), request.SortDirection?.ToLower()) switch
                {
                    ("title", "desc") => query.OrderByDescending(m => m.Title),
                    ("title", "asc") => query.OrderBy(m => m.Title),
                    ("year", "desc") => query.OrderByDescending(m => m.ReleaseDate),
                    ("year", "asc") => query.OrderBy(m => m.ReleaseDate),
                    ("id", "desc") => query.OrderByDescending(m => m.MovieId),
                    ("id", "asc") => query.OrderBy(m => m.MovieId),
                    _ => query.OrderBy(m => m.Title) //Domyślne sortowanie
                };

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
