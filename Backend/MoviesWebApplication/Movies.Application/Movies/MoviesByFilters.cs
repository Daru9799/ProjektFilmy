﻿using System;
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
    public class MoviesByFilters
    {
        public class Query : IRequest<PagedResponse<MovieDto>>
        {
            public List<string> CategoryNames { get; set; } //Szukanie po gatunkach
            public List<string> CountryNames { get; set; } //Szukanie po krajach
            public List<string> Actors { get; set; } //Szukanie po aktorach (lista stringów firstname + lastname)
            public List<string> Directors { get; set; } //Szukanie po reżyserach (lista stringów firstname + lastname)
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
                    .Include(m => m.MoviePerson)
                        .ThenInclude(mp => mp.Person);

                //Filtracja po tytule
                if (!string.IsNullOrEmpty(request.TitleSearch))
                {
                    var searchTerm = request.TitleSearch.ToLower();
                    query = query.Where(m => m.Title.ToLower().Contains(searchTerm));
                }

                //Filtracja po kategoriach
                if (request.CategoryNames != null && request.CategoryNames.Any())
                {
                    query = query.Where(m => request.CategoryNames.All(category => m.Categories.Any(c => c.Name == category)));
                }

                //Filtracja po krajach
                if (request.CountryNames != null && request.CountryNames.Any())
                {
                    query = query.Where(m => request.CountryNames.All(country => m.Countries.Any(c => c.Name == country)));
                }

                //Filtracja po reżyserach
                if (request.Directors != null && request.Directors.Any())
                {
                    query = query.Where(movie => request.Directors.All(director => movie.MoviePerson.Any(mp => mp.Role == MoviePerson.PersonRole.Director && (mp.Person.FirstName + " " + mp.Person.LastName).ToLower() == director.ToLower())));
                }

                //Filtracja po aktorach
                if (request.Actors != null && request.Actors.Any())
                {
                    query = query.Where(movie => request.Actors.All(actor => movie.MoviePerson.Any(mp => mp.Role == MoviePerson.PersonRole.Actor && (mp.Person.FirstName + " " + mp.Person.LastName).ToLower() == actor.ToLower())));
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
                    ("rating", "desc") => query.OrderByDescending(m => m.Reviews.Any(r => r.Rating > 0) ? m.Reviews.Where(r => r.Rating > 0).Average(r => r.Rating) : 0),  
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
