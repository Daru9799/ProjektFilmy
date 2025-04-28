using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollections;
using Movies.Domain;
using Movies.Domain.Entities;


namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionController:BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<MovieCollection>>> GetMovieCollectionsByUserId(Guid userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "likes", [FromQuery] string sortDirection = "desc")
        {
            var query = new CollectionsByUserId.Query
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };
            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono listy filmów dla użytkowinka o ID '{userId}'.");
            }

            return Ok(reviews);
        }

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<MovieCollection>>> GetMoiveCollection([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new MovieCollectionList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);
        }



        [Authorize]
        [HttpPost("add-collection")]
        public async Task<IActionResult> CreateMovieCollection([FromBody] CreateMovieCollection.CreateMovieCollectionCommand command)
        {
            try
            {
                var movieCollection = await Mediator.Send(command);
                return Ok(movieCollection);
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

                return Ok(result);
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

                return Ok(movieCollection);
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
