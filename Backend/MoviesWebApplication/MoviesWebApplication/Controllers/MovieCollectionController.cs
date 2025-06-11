using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollections;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionController:BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<MovieCollectionDto>>> GetMovieCollectionsByUserId(
            Guid userId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 2,
            [FromQuery] string orderBy = "likes",
            [FromQuery] string sortDirection = "desc",
            [FromQuery] List<MovieCollection.VisibilityMode> visibilityMode = null)
        {
            var query = new CollectionsByUserId.Query
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy,
                visibilityMode = visibilityMode
            };

            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono listy filmów dla użytkownika o ID '{userId}'.");
            }

            return Ok(reviews);
        }


        [AllowAnonymous] // do testow
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<MovieCollectionDto>>> GetMoiveCollection([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new MovieCollectionList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieCollectionDto>> GetMovieCollection(Guid id)
        {
            var movie = await Mediator.Send(new CollectionById.Query { Id = id });

            if (movie == null)
            {
                return NotFound($"Nie odnaleziono listy filmów z id {id}.");
            }

            return Ok(movie);
        }

        [Authorize]
        [HttpPost("add-collection")]
        public async Task<IActionResult> CreateMovieCollection([FromBody] CreateMovieCollection.CreateMovieCollectionCommand command)
        {
            try
            {
                var movieCollection = await Mediator.Send(command);
                return Ok(new
                {
                    message = "Pomyślnie utworzono kolekcję.",
                    collectionId = movieCollection.MovieCollectionId
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [Authorize]
        [HttpDelete("delete-collection/{id}")]
        public async Task<IActionResult> DeleteMovieCollection(Guid id)
        {
            try
            {
                var result = await Mediator.Send(new DeleteMovieCollection(id));

                if (result == null)
                {
                    return NotFound($"Nie znaleziono listy filmów z ID: {id}");
                }

                return Ok("Pomyślnie usunięto kolekcje.");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = $"Nie znaleziono kolekcji filmów z ID: {id}", exceptionMessage = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Wystąpił błąd: {ex.Message}", exceptionMessage = ex.ToString() });
            }
        }



        [Authorize]
        [HttpPatch("edit-collection/{id}")]
        public async Task<IActionResult> EditMovieCollection(Guid id, [FromBody] EditMovieCollection.EditMovieCollectionCommand command)
        {
            try
            {
                command.MovieCollectionId = id;

                var movieCollection = await Mediator.Send(command);

                return Ok("Pomyślnie zmieniono kolekcje.");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = $"Nie znaleziono kolekcji filmów z ID: {id}", exceptionMessage = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Wystąpił błąd: {ex.Message}", exceptionMessage = ex.ToString() });
            }
        }
    }
}
