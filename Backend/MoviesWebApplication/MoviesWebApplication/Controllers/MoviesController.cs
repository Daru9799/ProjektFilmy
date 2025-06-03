using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Domain;
using Microsoft.AspNetCore.Authorization;
using Movies.Domain.DTOs;

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

        //Zwracanie filmów dla podanego id reżysera
        [HttpGet("by-personId/{personId}")]
        public async Task<ActionResult<MovieDto>> GetMoviesByDirectorId(Guid personId)
        {
            var movie = await Mediator.Send(new MoviesByPersonId.Query { PersonId = personId });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono filmu o id {personId}.");
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

        [HttpGet("by-collectionId/{collectionId}")]
        public async Task<ActionResult<MovieDto>> GetMoviesByCollectionId(Guid collectionId)
        {
            var movie = await Mediator.Send(new MovieByCollectionId.Query { CollectionId = collectionId });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono filmu dla kolekcji z id {collectionId}.");
            }

            return Ok(movie);
        }

        [Authorize]
        [HttpPost("{collectionId}/add-movie/{movieId}")]
        public async Task<IActionResult> AddMovieToCollection(Guid collectionId, Guid movieId)
        {
            try
            {
                var command = new AddMovieToCollection.AddMovieToCollectionCommand
                {
                    MovieCollectionId = collectionId,
                    MovieId = movieId
                };

                var updatedCollection = await Mediator.Send(command);

                return Ok("Pomyślnie dodano film do kolekcji.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("{collectionId}/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromCollection(Guid collectionId, Guid movieId)
        {
            var result = await Mediator.Send(new DeleteMovieFromCollection.DeleteMovieFromCollectionCommand
            {
                MovieCollectionId = collectionId,
                MovieId = movieId
            });

            if (result == null)
            {
                return NotFound($"Nie znaleziono kolekcji filmów o ID: {collectionId} lub filmu o ID: {movieId}.");
            }

            return Ok("Pomyślnie usunięto film z kolekcji.");
        }
    }
}
