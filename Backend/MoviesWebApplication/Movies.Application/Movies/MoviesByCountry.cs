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
    public class MoviesByCountry
    {
        public class Query : IRequest<List<Movie>>
        {
            public string CountryName { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Movie>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Movie>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Pobierz filmy na podstawie nazwy kraju
                return await _context.Movies
                    .Where(m => m.Countries.Any(c => c.CountryName == request.CountryName))
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
