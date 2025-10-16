using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.People;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    [AllowAnonymous]
    public class PeopleController : BaseApiController
    {
        //Zwracanie wszystkich osób według podanej roli (aktor, reżyser) oraz id filmu (bez zwraca wszystko)
        [HttpGet("by-filters")]
        public async Task<ActionResult<PagedResponse<PersonDto>>> GetPeopleByRole([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string personSearch = "", [FromQuery] bool noPagination = false, [FromQuery] MoviePerson.PersonRole role = MoviePerson.PersonRole.Director, [FromQuery] Guid? movieId = null)
        {
            var query = new PeopleList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                PersonSearch = personSearch,
                NoPagination = noPagination,
                Role = role,
                MovieId = movieId
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        //Zwracanie osoby o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonDto>> GetActor(Guid id)
        {
            var query = new PersonById.Query { Id = id };

            return await Mediator.SendWithTypedExceptionHandling(query);

        }
    }
}
