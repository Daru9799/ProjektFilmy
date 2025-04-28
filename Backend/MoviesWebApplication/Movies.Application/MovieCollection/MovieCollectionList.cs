using System;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.MovieCollections
{
    public class MovieCollectionList
    {
        public class Query : IRequest<PagedResponse<MovieCollection>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
        }

        public class Handler : IRequestHandler<Query, PagedResponse<MovieCollection>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<MovieCollection>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Tworzymy zapytanie bazowe, bez sortowania i grupowania
                IQueryable<MovieCollection> query = _context.MovieCollections
                    .Include(mc => mc.User)
                    .Include(mc => mc.Movies);

                // Paginacja
                var movieCollections = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                // Obliczenie całkowitej liczby elementów
                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<MovieCollection>
                {
                    Data = movieCollections,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
