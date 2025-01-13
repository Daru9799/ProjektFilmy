using MediatR;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Application.Categories;
using Movies.Application.Countries;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Authorization;

namespace MoviesWebApplication.Controllers
{
    [AllowAnonymous]
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
            var movie = await Mediator.Send(new MovieById.Query { Id = id });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono filmu o id {id}.");
            }

            return Ok(movie);
        }
        //Zwracanie filmów dla podanego id aktora
        [HttpGet("by-actorId/{actorId}")]
        public async Task<ActionResult<MovieDto>> GetMoviesByActorId(Guid actorId)
        {
            var movie = await Mediator.Send(new MoviesByActorId.Query { ActorId = actorId });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono filmu o id {actorId}.");
            }

            return Ok(movie);
        }
        //Zwracanie filmów dla podanego id reżysera
        [HttpGet("by-directorId/{directorId}")]
        public async Task<ActionResult<MovieDto>> GetMoviesByDirectorId(Guid directorId)
        {
            var movie = await Mediator.Send(new MoviesByDirectorId.Query { DirectorId = directorId });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono filmu o id {directorId}.");
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
    }
}
