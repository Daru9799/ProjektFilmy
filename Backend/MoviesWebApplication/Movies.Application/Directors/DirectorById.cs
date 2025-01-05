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
    public class DirectorById
    {
        //Zapytanie przyjmuje ID aktora
        public class Query : IRequest<DirectorDto>
        {
            public Guid Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, DirectorDto>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<DirectorDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //Pobierz film z bazy na podstawie ID
                var director = await _context.Directors
                    .Include(m => m.Movies)
                        .ThenInclude(m => m.Categories)
                    .FirstOrDefaultAsync(m => m.DirectorId == request.Id, cancellationToken);

                if (director == null)
                {
                    return null;
                }

                //Obliczanie liczby filmów jakie reżyser stworzył
                var totalMovies = director.Movies.Count;

                //Najpopularniejszy gatunek w jakim grał
                var favoriteGenre = director.Movies
                    .SelectMany(m => m.Categories)
                    .GroupBy(c => c.Name)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .FirstOrDefault();

                return new DirectorDto
                {
                    DirectorId = director.DirectorId,
                    FirstName = director.FirstName,
                    LastName = director.LastName,
                    Bio = director.Bio,
                    BirthDate = director.BirthDate,
                    PhotoUrl = director.PhotoUrl,
                    TotalMovies = totalMovies,
                    FavoriteGenre = favoriteGenre
                };
            }
        }
    }
}
