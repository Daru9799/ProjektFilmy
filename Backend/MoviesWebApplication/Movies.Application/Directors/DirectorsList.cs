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
        public class Query : IRequest<PagedResponse<DirectorDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string DirectorSearch { get; set; } //Do wyszukiwania po nazwie
            public bool NoPagination { get; set; } //Wylączanie, włączanie paginacji
        }
        public class Handler : IRequestHandler<Query, PagedResponse<DirectorDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<DirectorDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Director> query = _context.Directors
                    .Include(d => d.Movies)
                        .ThenInclude(m => m.Categories);

                //Filtracja po imieniu i nazwisku
                if (!string.IsNullOrEmpty(request.DirectorSearch))
                {
                    var searchTerm = request.DirectorSearch.ToLower();
                    query = query.Where(director => (director.FirstName.ToLower() + " " + director.LastName.ToLower()).Contains(searchTerm));
                }

                //Jeśli paginacja jest wyłączona zwróci wszystkich reżyserów
                if (request.NoPagination)
                {
                    var directors = await query.ToListAsync(cancellationToken);

                    var directorDtos = directors.Select(d => new DirectorDto
                    {
                        DirectorId = d.DirectorId,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        Bio = d.Bio,
                        BirthDate = d.BirthDate,
                        PhotoUrl = d.PhotoUrl,
                        TotalMovies = d.Movies.Count, 
                        FavoriteGenre = d.Movies
                            .SelectMany(m => m.Categories)
                            .GroupBy(c => c.Name)
                            .OrderByDescending(g => g.Count())
                            .Select(g => g.Key)
                            .FirstOrDefault() 
                    }).ToList();

                    return new PagedResponse<DirectorDto>
                    {
                        Data = directorDtos,
                        TotalItems = directorDtos.Count,
                        PageNumber = 1,
                        PageSize = directorDtos.Count
                    };
                }
                else
                {
                    //Paginacja
                    var directors = await query
                        .Skip((request.PageNumber - 1) * request.PageSize)
                        .Take(request.PageSize)
                        .ToListAsync(cancellationToken);

                    var directorDtos = directors.Select(d => new DirectorDto
                    {
                        DirectorId = d.DirectorId,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        Bio = d.Bio,
                        BirthDate = d.BirthDate,
                        PhotoUrl = d.PhotoUrl,
                        TotalMovies = d.Movies.Count,
                        FavoriteGenre = d.Movies
                            .SelectMany(m => m.Categories)
                            .GroupBy(c => c.Name)
                            .OrderByDescending(g => g.Count())
                            .Select(g => g.Key)
                            .FirstOrDefault() 
                    }).ToList();

                    //Obliczenie całkowitej liczby reżyserów
                    int totalItems = await query.CountAsync(cancellationToken);

                    return new PagedResponse<DirectorDto>
                    {
                        Data = directorDtos,
                        TotalItems = totalItems,
                        PageNumber = request.PageNumber,
                        PageSize = request.PageSize
                    };
                }
            }
        }
    }
}
