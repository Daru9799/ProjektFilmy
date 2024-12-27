using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Reviews
{
    public class ReviewsByMovieId
    {
        public class Query : IRequest<List<Review>>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Review>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Review>> Handle(Query request, CancellationToken cancellationToken)
            {
                var categories = await _context.Movies
                    .Where(m => m.MovieId == request.MovieId)
                    .SelectMany(m => m.Reviews)
                    .ToListAsync();
                return categories;
            }
        }
    }
}
