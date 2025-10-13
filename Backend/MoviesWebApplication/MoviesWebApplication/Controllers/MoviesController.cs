using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Domain;
using Microsoft.AspNetCore.Authorization;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using static Movies.Application.Movies.AddMovieToPlanned;
using static Movies.Application.Movies.AddMovieToWatched;
using MoviesWebApplication.Responses;
using Movies.Application.People;

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
                return NotFound(ApiResponse.NotFound($"Nie odnaleziono filmu o id {id}."));
            }

            return Ok(movie);
        }
        //Zwraca liste filmów, poprzez listę movieId tych filmów.
        [HttpGet("get-list-by-id")]
        public async Task<ActionResult<List<MovieDto>>> GetMovieListById(
            [FromQuery] List<Guid> movieIdList = null) 
        {
            var movies = await Mediator.Send(new MoviesListByIds.Query { moviesIds = movieIdList });
            if (movies == null)
            {
                return NotFound(ApiResponse.NotFound($"Nie odnaleziono filmów o podanych id {movieIdList}."));
            }
            return Ok(movies);
        }

        //Zwracanie filmów dla podanego id reżysera
        [HttpGet("by-personId/{personId}")]
        public async Task<ActionResult<MovieDto>> GetMoviesByDirectorId(Guid personId)
        {
            var movie = await Mediator.Send(new MoviesByPersonId.Query { PersonId = personId });

            if (movie == null)
            {
                return NotFound(ApiResponse.NotFound($"Nie odnaleziono filmu o id {personId}."));
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
                return NotFound(ApiResponse.NotFound($"Nie znaleziono filmów dla podanych filtrów."));
            }

            return Ok(pagedMovies);
        }

        [HttpGet("by-collectionId/{collectionId}")]
        public async Task<ActionResult<List<MovieDto>>> GetMoviesByCollectionId(
            Guid collectionId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var movies = await Mediator.Send(new MovieByCollectionId.Query
            {
                CollectionId = collectionId,
                PageNumber = pageNumber,
                PageSize = pageSize
            });

            if (movies == null || !movies.Any())
            {
                return NotFound(ApiResponse.NotFound($"Nie odnaleziono filmów dla kolekcji z id {collectionId}."));
            }

            return Ok(movies);
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
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch(KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dodać filmu do kolekcji filmów. \n{ex.Message}"));
            }
        }

        [Authorize]
        [HttpDelete("{collectionId}/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromCollection(Guid collectionId, Guid movieId)
        {
            try
            {
                var result = await Mediator.Send(new DeleteMovieFromCollection.DeleteMovieFromCollectionCommand
                {
                    MovieCollectionId = collectionId,
                    MovieId = movieId
                });

                if (result == null)
                {
                    return NotFound(ApiResponse.NotFound($"Nie znaleziono kolekcji filmów o ID: {collectionId} lub filmu o ID: {movieId}."));
                }

                return Ok("Pomyślnie usunięto film z kolekcji.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się usunąć filmu z kolekcji filmów. \n{ex.Message}"));
            }

        }
        //Dodawanie do listy planowanych
        [Authorize]
        [HttpPost("planned/add-movie")]
        public async Task<IActionResult> AddMovieToPlanned([FromBody] AddMovieToPlannedCommand command)
        {
            try
            {
                var updatedCollection = await Mediator.Send(command);
                return Ok("Pomyślnie dodano film do planowanych.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dodać filmu do listy planowanych filmów. \n{ex.Message}"));
            }
        }
        //Dodawanie do listy obejrzanych
        [Authorize]
        [HttpPost("watched/add-movie")]
        public async Task<IActionResult> AddMovieToWatched([FromBody] AddMovieToWatchedCommand command)
        {
            try
            {
                var updatedCollection = await Mediator.Send(command);
                return Ok("Pomyślnie dodano film do obejrzanych.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dodać filmu do listy obejrzanych filmów. \n{ex.Message}"));
            }
        }
        // Usuwanie z listy planowanych
        [Authorize]
        [HttpDelete("planned/delete-from-planned/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromPlanned(Guid movieId)
        {
            try
            {
                var command = new DeleteMovieFromPlanned.DeleteMovieFromPlannedCommand { MovieId = movieId };
                var updatedCollection = await Mediator.Send(command);
                return Ok("Pomyślnie usunięto film z listy planowanych.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się usunąć filmu z listy planowanych filmów. \n{ex.Message}"));
            }
        }
        // Usuwanie z listy obejrzanych
        [Authorize]
        [HttpDelete("watched/delete-from-watched/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromWatched(Guid movieId)
        {
            try
            {
                var command = new DeleteMovieFromWatched.DeleteMovieFromWatchedCommand { MovieId = movieId };
                var updatedCollection = await Mediator.Send(command);
                return Ok("Pomyślnie usunięto film z listy obejrzanych.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się usunąć filmu z listy planowanych filmów. \n{ex.Message}"));
            }
        }

        [Authorize]
        [HttpGet("check-if-in-list/{listType}/{movieId}")]
        public async Task<IActionResult> CheckIfInList(string listType, Guid movieId)
        {
            try
            {
                var query = new CheckIfMovieInList.Query(movieId, listType);
                var isInList = await Mediator.Send(query);
                return Ok(isInList);
            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse.BadRequest(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się sprawdzić czy film jest na liście objerzanych/planowanych. \n{ex.Message}"));
            }
        }
    }
}
