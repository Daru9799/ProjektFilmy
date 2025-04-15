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
    public class CountriesList
    {
        public class Query : IRequest<List<Country>> { }
        public class Handler : IRequestHandler<Query, List<Country>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Country>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Countries.ToListAsync();
            }
        }
    }
}
