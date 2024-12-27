using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Categories
{
    public class CategoriesList
    {
        public class Query : IRequest<List<Category>> { }
        public class Handler : IRequestHandler<Query, List<Category>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Category>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Categories.ToListAsync();
            }
        }
    }
}
