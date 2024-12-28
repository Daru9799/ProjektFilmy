using Microsoft.AspNetCore.Mvc;
using Movies.Application.Countries;
using Movies.Application.Directors;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class DirectorsController : BaseApiController
    {
        //Zwracanie wszystkich reżyserów
        [HttpGet("all")]
        public async Task<ActionResult<List<Director>>> GetDirectors()
        {
            return await Mediator.Send(new DirectorsList.Query());
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
    }
}
