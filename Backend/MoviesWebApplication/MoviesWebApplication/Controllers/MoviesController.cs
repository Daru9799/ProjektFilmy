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
            var movie = await Mediator.Send(new MoviesById.Query { Id = id });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono filmu o id {id}.");
            }

            return Ok(movie);
        }
        //Zwracanie filmów na podstawie filtrów
        [HttpGet("by-filters")]
        public async Task<ActionResult<PagedResponse<MovieDto>>> GetMoviesByCountry([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "title", [FromQuery] string sortDirection = "asc", [FromQuery] string titleSearch = "", [FromQuery] List<string> countryNames = null, [FromQuery] List<string> categoryNames = null, [FromQuery] List<string> actorsList = null, [FromQuery] List<string> directorsList = null)
        {
            var query = new MoviesByFilters.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                OrderBy = orderBy,
                SortDirection = sortDirection,
                CountryNames = countryNames,
                CategoryNames = categoryNames,
                TitleSearch = titleSearch,
                Actors = actorsList,
                Directors = directorsList
            };

            var pagedMovies = await Mediator.Send(query);

            if (pagedMovies == null || !pagedMovies.Data.Any())
            {
                return NotFound($"Nie znaleziono filmów dla podanych filtrów.");
            }

            return Ok(pagedMovies);
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
