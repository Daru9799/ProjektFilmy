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
        public class Query : IRequest<PagedResponse<Director>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string DirectorSearch { get; set; } //Do wyszukiwania po nazwie
        }
        public class Handler : IRequestHandler<Query, PagedResponse<Director>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<Director>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Director> query = _context.Directors;

                //Filtracja po imieniu i nazwisku
                if (!string.IsNullOrEmpty(request.DirectorSearch))
                {
                    var searchTerm = request.DirectorSearch.ToLower();
                    query = query.Where(director => (director.FirstName.ToLower() + " " + director.LastName.ToLower()).Contains(searchTerm));
                }

                //Paginacja
                var directors = await query
                    .Skip((request.PageNumber - 1) * request.PageSize) 
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                //Obliczenie całkowitej liczby reżyserów
                int totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<Director>
                {
                    Data = directors,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
