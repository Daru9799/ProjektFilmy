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
        public class Query : IRequest<PagedResponse<ActorDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string ActorSearch { get; set; } //Do wyszukiwania po nazwie
            public bool NoPagination { get; set; } //Wylączanie, włączanie paginacji
        }
        public class Handler : IRequestHandler<Query, PagedResponse<ActorDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<ActorDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Actor> query = _context.Actors;

                //Filtracja po imieniu i nazwisku
                if (!string.IsNullOrEmpty(request.ActorSearch))
                {
                    var searchTerm = request.ActorSearch.ToLower();
                    query = query.Where(actor => (actor.FirstName.ToLower() + " " + actor.LastName.ToLower()).Contains(searchTerm));
                }

                var actorDtosQuery = query.Select(actor => new ActorDto
                {
                    ActorId = actor.ActorId,
                    FirstName = actor.FirstName,
                    LastName = actor.LastName,
                    Bio = actor.Bio,
                    BirthDate = actor.BirthDate,
                    PhotoUrl = actor.PhotoUrl,
                    TotalMovies = actor.Movies.Count,
                    FavoriteGenre = actor.Movies
                        .SelectMany(m => m.Categories)
                        .GroupBy(c => c.Name)
                        .OrderByDescending(g => g.Count())
                        .Select(g => g.Key)
                        .FirstOrDefault()
                });

                //Jeśli paginacja jest wyłączona
                if (request.NoPagination)
                {
                    var actors = await actorDtosQuery.ToListAsync(cancellationToken);
                    return new PagedResponse<ActorDto>
                    {
                        Data = actors,
                        TotalItems = actors.Count,
                        PageNumber = 1,
                        PageSize = actors.Count
                    };
                }

                //Paginacja
                var actorsPaged = await actorDtosQuery
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                var totalItems = await query.CountAsync(cancellationToken);

                return new PagedResponse<ActorDto>
                {
                    Data = actorsPaged,
                    TotalItems = totalItems,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }
        }
    }
}
