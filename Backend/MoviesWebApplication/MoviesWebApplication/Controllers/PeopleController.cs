using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.People;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    [AllowAnonymous]
    public class PeopleController : BaseApiController
    {
        //Zwracanie wszystkich osób według podanej roli (aktor, reżyser) oraz id filmu (bez zwraca wszystko)
        [HttpGet("by-filters")]
        public async Task<ActionResult<PagedResponse<PersonDto>>> GetPeopleByRole([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string personSearch = "", [FromQuery] bool noPagination = false, [FromQuery] MoviePerson.PersonRole role = MoviePerson.PersonRole.Director, [FromQuery] Guid? movieId = null)
        {
            var result = await Mediator.Send(new PeopleList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                PersonSearch = personSearch,
                NoPagination = noPagination,
                Role = role,
                MovieId = movieId
            });

            if (result == null || result.Data.Count == 0)
            {
                return NotFound("Nie znaleziono osób dla podanej roli.");
            }

            return Ok(result);
        }

        //Zwracanie osoby o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonDto>> GetActor(Guid id)
        {
            var director = await Mediator.Send(new PersonById.Query { Id = id });

            if (director == null)
            {
                return NotFound($"Nie odnaleziono osoby o id {id}.");
            }

            return Ok(director);
        }
    }
}
