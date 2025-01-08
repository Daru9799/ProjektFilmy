using Microsoft.AspNetCore.Mvc;
using Movies.Application.Actors;
using Movies.Application.Countries;
using Movies.Application.Directors;
using Movies.Application.Movies;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class DirectorsController : BaseApiController
    {
        //Zwracanie wszystkich reżyserów
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<DirectorDto>>> GetDirectors([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string directorSearch = "", [FromQuery] bool noPagination = false)
        {
            var result = await Mediator.Send(new DirectorsList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                DirectorSearch = directorSearch,
                NoPagination = noPagination
            });

            if (result == null)
            {
                return NotFound("Nie znaleziono żadnych reżyserów.");
            }

            return Ok(result);
        }

        //Zwracanie reżyserów na podstawie ID filmu
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<List<Country>>> GetDirectorsByMovieId(Guid movieId)
        {
            var query = new DirectorsByMovieId.Query { MovieId = movieId };
            var directors = await Mediator.Send(query);

            if (directors == null || !directors.Any())
            {
                return NotFound($"Nie znaleziono reżyserów dla filmu o ID '{movieId}'.");
            }

            return Ok(directors);
        }
        //Zwracanie reżysera o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<DirectorDto>> GetActor(Guid id)
        {
            var director = await Mediator.Send(new DirectorById.Query { Id = id });

            if (director == null)
            {
                return NotFound($"Nie odnaleziono reżysera o id {id}.");
            }

            return Ok(director);
        }
    }
}
