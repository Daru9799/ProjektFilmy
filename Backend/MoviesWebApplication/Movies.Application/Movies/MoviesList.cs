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
        public class Query : IRequest<List<Movie>> 
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string OrderBy { get; set; }
        }
        public class Handler : IRequestHandler<Query, List<Movie>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Movie>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Movie> query = _context.Movies;

                //Obsługa sortowania filmów np. po tytule, roku produkcji id 
                query = request.OrderBy?.ToLower() switch
                {
                    "title" => query.OrderBy(m => m.Title),
                    "year" => query.OrderBy(m => m.ReleaseDate),
                    "id" => query.OrderBy(m => m.MovieId),
                    _ => query.OrderBy(m => m.Title) //Domyślne sortowanie
                };

                //Obsługa paginacji
                return await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
