using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;

namespace Movies.Application.Countries
{
    public class CountriesByMovieId
    {
        public class Query : IRequest<List<Country>>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Country>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Country>> Handle(Query request, CancellationToken cancellationToken)
            {
                var countries = await _context.Movies
                    .Where(m => m.MovieId == request.MovieId) 
                    .SelectMany(m => m.Countries)
                    .ToListAsync();

                return countries;
            }
        }
    }
}
