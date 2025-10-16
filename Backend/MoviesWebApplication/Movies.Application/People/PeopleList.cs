using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using static Movies.Domain.Entities.MoviePerson;

namespace Movies.Application.People
{
    public class PeopleList
    {
        public class Query : IRequest<PagedResponse<PersonDto>>
        {
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public string PersonSearch { get; set; } //Do wyszukiwania po nazwie
            public bool NoPagination { get; set; } //Wylączanie, włączanie paginacji
            public PersonRole Role { get; set; }
            public Guid? MovieId { get; set; }
        }
        public class Handler : IRequestHandler<Query, PagedResponse<PersonDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<PagedResponse<PersonDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<Person> query = _context.People
                    .Include(p => p.MoviePerson)
                        .ThenInclude(mp => mp.Movie)
                            .ThenInclude(m => m.Categories)
                    .Where(p => p.MoviePerson.Any(mp => mp.Role == request.Role));

                //Filtracja po id filmu
                if (request.MovieId.HasValue)
                {
                    query = query.Where(p => p.MoviePerson.Any(mp => mp.Movie.MovieId == request.MovieId.Value));
                }

                //Filtracja po imieniu i nazwisku
                if (!string.IsNullOrEmpty(request.PersonSearch))
                {
                    var searchTerm = request.PersonSearch.ToLower();
                    query = query.Where(person => (person.FirstName.ToLower() + " " + person.LastName.ToLower()).Contains(searchTerm));
                }

                //Jeśli paginacja jest wyłączona zwróci wszystkich reżyserów
                if (request.NoPagination)
                {
                    var people = await query.ToListAsync(cancellationToken);

                    var personDtos = people.Select(p => new PersonDto
                    {
                        PersonId = p.PersonId,
                        FirstName = p.FirstName,
                        LastName = p.LastName,
                        Bio = p.Bio,
                        BirthDate = p.BirthDate,
                        PhotoUrl = p.PhotoUrl,
                        TotalMovies = p.MoviePerson.Count(mp => mp.Role == request.Role),
                        FavoriteGenre = p.MoviePerson
                            .Where(mp => mp.Role == request.Role)
                            .SelectMany(mp => mp.Movie.Categories)
                            .GroupBy(c => c.Name)
                            .OrderByDescending(g => g.Count())
                            .Select(g => g.Key)
                            .FirstOrDefault()
                    }).ToList();

                    if (personDtos == null || personDtos.Count == 0)
                    {
                        throw new NotFoundException("Nie znaleziono osób dla podanej roli.");
                    }

                    return new PagedResponse<PersonDto>
                    {
                        Data = personDtos,
                        TotalItems = personDtos.Count,
                        PageNumber = 1,
                        PageSize = personDtos.Count
                    };
                }
                else
                {
                    //Paginacja
                    var people = await query
                        .Skip((request.PageNumber - 1) * request.PageSize)
                        .Take(request.PageSize)
                        .ToListAsync(cancellationToken);

                    var personDtos = people.Select(p => new PersonDto
                    {
                        PersonId = p.PersonId,
                        FirstName = p.FirstName,
                        LastName = p.LastName,
                        Bio = p.Bio,
                        BirthDate = p.BirthDate,
                        PhotoUrl = p.PhotoUrl,
                        TotalMovies = p.MoviePerson.Count(mp => mp.Role == request.Role),
                        FavoriteGenre = p.MoviePerson
                            .Where(mp => mp.Role == request.Role)
                            .SelectMany(mp => mp.Movie.Categories)
                            .GroupBy(c => c.Name)
                            .OrderByDescending(g => g.Count())
                            .Select(g => g.Key)
                            .FirstOrDefault()
                    }).ToList();

                    if (personDtos == null || personDtos.Count == 0)
                    {
                        throw new NotFoundException("Nie znaleziono osób dla podanej roli.");
                    }

                    //Obliczenie całkowitej liczby osób
                    int totalItems = await query.CountAsync(cancellationToken);

                    return new PagedResponse<PersonDto>
                    {
                        Data = personDtos,
                        TotalItems = totalItems,
                        PageNumber = request.PageNumber,
                        PageSize = request.PageSize
                    };
                }
            }
        }
    }
}
