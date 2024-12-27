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
    public class ReviewsList
    {
        //Lista obiektów typu recenzje
        public class Query : IRequest<List<Review>> { }
        public class Handler : IRequestHandler<Query, List<Review>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Review>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Reviews
                    .Include(r => r.Movie)
                    .ToListAsync();
            }
        }
    }
}
