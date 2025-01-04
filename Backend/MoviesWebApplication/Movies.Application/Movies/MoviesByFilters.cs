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
        public class Query : IRequest<PagedResponse<MovieDto>>
        {
            public List<string> CategoryNames { get; set; } //Szukanie po gatunkach
            public List<string> CountryNames { get; set; } //Szukanie po krajach
            public string TitleSearch { get; set; } //Szukanie po tytule
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
                IQueryable<Movie> query = _context.Movies
                    .Include(m => m.Reviews)
                    .Include(m => m.Categories)
                    .Include(m => m.Countries)
                    .Include(m => m.Directors);

                //Filtracja po tytule
                if (!string.IsNullOrEmpty(request.TitleSearch))
                {
                    var searchTerm = request.TitleSearch.ToLower();
                    query = query.Where(m => m.Title.ToLower().Contains(searchTerm));
                }

                //Filtracja po kategoriach
                if (request.CategoryNames != null && request.CategoryNames.Any())
                {
                    query = query.Where(m => m.Categories.Any(c => request.CategoryNames.Contains(c.Name)));
                }

                //Filtracja po krajach
                if (request.CountryNames != null && request.CountryNames.Any())
                {
                    query = query.Where(m => m.Countries.Any(c => request.CountryNames.Contains(c.Name)));
                }

                //Obsługa sortowania
                query = (request.OrderBy?.ToLower(), request.SortDirection?.ToLower()) switch
                {
                    ("title", "desc") => query.OrderByDescending(m => m.Title),
                    ("title", "asc") => query.OrderBy(m => m.Title),
                    ("year", "desc") => query.OrderByDescending(m => m.ReleaseDate),
                    ("year", "asc") => query.OrderBy(m => m.ReleaseDate),
                    ("id", "desc") => query.OrderByDescending(m => m.MovieId),
                    ("id", "asc") => query.OrderBy(m => m.MovieId),
                    ("rating", "desc") => query.OrderByDescending(m => m.Reviews.Any() ? m.Reviews.Average(r => r.Rating) : 0),  
                    ("rating", "asc") => query.OrderBy(m => m.Reviews.Any() ? m.Reviews.Average(r => r.Rating) : 0),
                    ("reviews", "desc") => query.OrderByDescending(m => m.Reviews.Count),
                    ("reviews", "asc") => query.OrderBy(m => m.Reviews.Count),
                    _ => query.OrderBy(m => m.Title) //Domyślne sortowanie po tytule
                };

                //Paginacja
                var movies = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                //Obliczenie całkowitej liczby elementów
                int totalItems = await query.CountAsync(cancellationToken);

                //Zwrócenie odpowiednich filmów
                var movieDtos = movies.Select(m => new MovieDto
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    ReleaseDate = m.ReleaseDate,
                    PosterUrl = m.PosterUrl,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReviewsNumber = m.Reviews.Count,
                    ScoresNumber = m.Reviews.Count(r => r.Rating > 0),
                    AverageScore = m.Reviews.Any(r => r.Rating > 0)
                        ? m.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating)
                        : 0,
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
                    Directors = m.Directors.Select(c => new DirectorDto
                    {
                        DirectorId = c.DirectorId,
                        FirstName = c.FirstName,
                        LastName = c.LastName,
                        Bio = c.Bio,
                        BirthDate = c.BirthDate,
                        PhotoUrl = c.PhotoUrl
                    }).ToList()
                }).ToList();

                // Zwrócenie odpowiedzi paginowanej
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
