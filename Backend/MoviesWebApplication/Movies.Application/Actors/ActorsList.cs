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
        public class Query : IRequest<PagedResponse<Actor>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }
        public class Handler : IRequestHandler<Query, PagedResponse<Actor>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<Actor>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Actor> query = _context.Actors;

                //Paginacja
                var actors = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)  
                    .Take(request.PageSize)                            
                    .ToListAsync(cancellationToken);

                //Obliczenie całkowitej liczby aktorów
                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<Actor>
                {
                    Data = actors,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
