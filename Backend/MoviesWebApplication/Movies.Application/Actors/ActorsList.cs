using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Actors
{
    public class ActorsList
    {
        //Lista obiektów typu aktorów
        public class Query : IRequest<List<Actor>> { }
        public class Handler : IRequestHandler<Query, List<Actor>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Actor>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Actors.ToListAsync();
            }
        }
    }
}
