using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;

namespace Movies.Application.Categories
{
    public class CategoriesByMovieId
    {
        public class Query : IRequest<List<Category>>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Category>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Category>> Handle(Query request, CancellationToken cancellationToken)
            {
                var categories = await _context.Movies
                    .Where(m => m.MovieId == request.MovieId) 
                    .SelectMany(m => m.Categories)
                    .ToListAsync();
                return categories;
            }
        }
    }
}
