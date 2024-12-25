using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Infrastructure;

namespace Movies.Application.Movies
{
    public class CreateMovie
    {
        public class Command : IRequest<Movie>
        {
            public string Title { get; set; }
            public DateTime ReleaseDate { get; set; }
            public string PosterUrl { get; set; }
            public List<Guid> CountryIds { get; set; } // Lista CountryId dla relacji
            public List<Guid> CategoryIds { get; set; } // Lista CategoryId dla relacji
        }

        public class Handler : IRequestHandler<Command, Movie>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Movie> Handle(Command request, CancellationToken cancellationToken)
            {
                //Weryfikacja istnienia krajów
                var countries = await _context.Countries
                    .Where(c => request.CountryIds.Contains(c.CountryId))
                    .ToListAsync(cancellationToken);

                var invalidCountryIds = request.CountryIds.Except(countries.Select(c => c.CountryId)).ToList();
                if (invalidCountryIds.Any())
                {
                    throw new ValidationException($"Nie znaleziono krajów dla następujących ID: {string.Join(", ", invalidCountryIds)}");
                }

                //Weryfikacja istnienia kategorii
                var categories = await _context.Categories
                    .Where(c => request.CategoryIds.Contains(c.CategoryId))
                    .ToListAsync(cancellationToken);

                var invalidCategoryIds = request.CategoryIds.Except(categories.Select(c => c.CategoryId)).ToList();
                if (invalidCategoryIds.Any())
                {
                    throw new ValidationException($"Nie znaleziono kategorii dla następujących ID: {string.Join(", ", invalidCategoryIds)}");
                }

                //Tworzenie nowego filmu
                var movie = new Movie
                {
                    MovieId = Guid.NewGuid(),
                    Title = request.Title,
                    ReleaseDate = request.ReleaseDate,
                    PosterUrl = request.PosterUrl,
                    Countries = await _context.Countries.Where(c => request.CountryIds.Contains(c.CountryId)).ToListAsync(cancellationToken),
                    Categories = await _context.Categories.Where(c => request.CategoryIds.Contains(c.CategoryId)).ToListAsync(cancellationToken)
                };

                //Dodanie nowego filmu do bazy
                _context.Movies.Add(movie);
                await _context.SaveChangesAsync(cancellationToken);

                return movie;
            }
        }
    }
}
