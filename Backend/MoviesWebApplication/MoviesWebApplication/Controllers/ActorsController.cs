using Microsoft.AspNetCore.Mvc;
using Movies.Application.Actors;
using Movies.Application.Movies;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class ActorsController : BaseApiController
    {
        //Zwracanie wszystkich aktorów
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<ActorDto>>> GetActors([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string actorSearch = "", [FromQuery] bool noPagination = false)
        {
            var result = await Mediator.Send(new ActorsList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                ActorSearch = actorSearch,
                NoPagination = noPagination
            });

            if (result == null)
            {
                return NotFound("Nie znaleziono żadnych aktorów.");
            }

            return Ok(result);
        }
        //Zwracanie aktorów na podstawie ID filmu
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<List<Actor>>> GetActorsByMovieId(Guid movieId)
        {
            var query = new ActorsByMovieId.Query { MovieId = movieId };
            var actors = await Mediator.Send(query);

            if (actors == null || !actors.Any())
            {
                return NotFound($"Nie znaleziono aktorów dla filmu o ID '{movieId}'.");
            }

            return Ok(actors);
        }

        //Zwracanie aktora o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<ActorDto>> GetActor(Guid id)
        {
            var actor = await Mediator.Send(new ActorById.Query { Id = id });

            if (actor == null)
            {
                return NotFound($"Nie odnaleziono aktora o id {id}.");
            }

            return Ok(actor);
        }
    }
}
