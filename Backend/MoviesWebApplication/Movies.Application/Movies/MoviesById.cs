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
    public class MoviesById
    {
        //Zapytanie przyjmuje ID filmu
        public class Query : IRequest<Movie>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, Movie>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Movie> Handle(Query request, CancellationToken cancellationToken)
            {
                // Pobierz film z bazy na podstawie ID
                return await _context.Movies
                    .FirstOrDefaultAsync(m => m.MovieId == request.Id);
            }
        }
    }
}
