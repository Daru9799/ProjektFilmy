using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.DTOs;
using Movies.Infrastructure;

namespace Movies.Application.People
{
    public class PersonById
    {
        public class Query : IRequest<PersonDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, PersonDto>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PersonDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var person = await _context.People
                    .Include(p => p.MoviePerson)
                        .ThenInclude(mp => mp.Movie)
                            .ThenInclude(m => m.Categories)
                    .FirstOrDefaultAsync(p => p.PersonId == request.Id, cancellationToken);

                if (person == null)
                {
                    throw new NotFoundException($"Nie odnaleziono osoby o id {request.Id}.");
                }

                var totalMovies = person.MoviePerson.Count;

                var favoriteGenre = person.MoviePerson
                    .SelectMany(mp => mp.Movie.Categories)
                    .GroupBy(c => c.Name)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .FirstOrDefault();

                return new PersonDto
                {
                    PersonId = person.PersonId,
                    FirstName = person.FirstName,
                    LastName = person.LastName,
                    Bio = person.Bio,
                    BirthDate = person.BirthDate,
                    PhotoUrl = person.PhotoUrl,
                    TotalMovies = totalMovies,
                    FavoriteGenre = favoriteGenre
                };
            }
        }
    }
}
