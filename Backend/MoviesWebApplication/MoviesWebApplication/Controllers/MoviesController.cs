using MediatR;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Application.Categories;
using Movies.Application.Countries;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MoviesWebApplication.Controllers
{
    public class MoviesController : BaseApiController
    {
        //Zwracanie wszystkich filmów
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<MovieDto>>> GetMovies([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "title", [FromQuery] string sortDirection = "asc")
        {
            return await Mediator.Send(new MoviesList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                OrderBy = orderBy,
                SortDirection = sortDirection
            });
        }
        //Zwracanie filmu o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDto>> GetMovie(Guid id)
        {
            return await Mediator.Send(new MoviesById.Query { Id = id });
        }
        //Zwracanie filmów na podstawie filtrów
        [HttpGet("by-filters")]
        public async Task<ActionResult<List<MovieDto>>> GetMoviesByCountry([FromQuery] List<string> countryNames, [FromQuery] List<string> categoryNames)
        {
            var query = new MoviesByFilters.Query { CountryNames = countryNames, CategoryNames = categoryNames };
            var movies = await Mediator.Send(query);
            if (movies == null || !movies.Any())
            {
                return NotFound($"Nie znaleziono filmów dla podanych filtrów.");
            }
            return Ok(movies);
        }
        //Dodawanie filmu
        [HttpPost]
        public async Task<ActionResult<Movie>> CreateMovie([FromBody] CreateMovie.Command command)
        {
            if (command == null)
            {
                return BadRequest("Nieprawidłowe dane wejściowe.");
            }
            // Wysłanie komendy do Mediatora
            var movie = await Mediator.Send(command);
            return Ok(movie);
        }
    }
}
