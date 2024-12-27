using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Directors
{
    public class DirectorsList
    {
        //Lista obiektów typu reżyserowie
        public class Query : IRequest<List<Director>> { }
        public class Handler : IRequestHandler<Query, List<Director>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Director>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Directors.ToListAsync();
            }
        }
    }
}
