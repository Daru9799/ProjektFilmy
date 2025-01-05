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
    public class ActorById
    {
        //Zapytanie przyjmuje ID aktora
        public class Query : IRequest<ActorDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, ActorDto>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<ActorDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //Pobierz film z bazy na podstawie ID
                var actor = await _context.Actors
                    .Include(m => m.Movies)
                        .ThenInclude(m => m.Categories)
                    .FirstOrDefaultAsync(m => m.ActorId == request.Id, cancellationToken);

                if (actor == null)
                {
                    return null;
                }

                //Obliczanie liczby filmów w jakich aktor wystąpił
                var totalMovies = actor.Movies.Count;

                //Najpopularniejszy gatunek w jakim grał
                var favoriteGenre = actor.Movies
                    .SelectMany(m => m.Categories) 
                    .GroupBy(c => c.Name) 
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .FirstOrDefault();

                return new ActorDto
                {
                    ActorId = actor.ActorId,
                    FirstName = actor.FirstName,
                    LastName = actor.LastName,
                    Bio = actor.Bio,
                    BirthDate = actor.BirthDate,
                    PhotoUrl = actor.PhotoUrl,
                    TotalMovies = totalMovies,
                    FavoriteGenre = favoriteGenre
                };
            }
        }
    }
}
