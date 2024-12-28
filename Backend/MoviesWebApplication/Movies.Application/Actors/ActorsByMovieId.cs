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
    public class ActorsByMovieId
    {
        public class Query : IRequest<List<Actor>>
        {
            public Guid MovieId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Actor>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Actor>> Handle(Query request, CancellationToken cancellationToken)
            {
                var actors = await _context.Movies
                    .Where(m => m.MovieId == request.MovieId)
                    .SelectMany(m => m.Actors)
                    .ToListAsync();
                return actors;
            }
        }
    }
}
