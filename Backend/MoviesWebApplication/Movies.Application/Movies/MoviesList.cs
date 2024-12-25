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
        public class Query : IRequest<List<Movie>> { }
        public class Handler : IRequestHandler<Query, List<Movie>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Movie>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Movies.ToListAsync();
            }
        }
    }
}
