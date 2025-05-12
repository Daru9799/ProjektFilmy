using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollectionReviews;
using Movies.Domain.DTOs;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionReviewsController : BaseApiController
    {
        //Zwracanie recenzji dla podanej listy filmowej
        [AllowAnonymous]
        [HttpGet("by-movie-collection-id/{movieCollectionId}")]
        public async Task<ActionResult<List<MovieCollectionReviewDto>>> GetReviewsByMovieCollectionId(Guid movieCollectionId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsByMovieCollectionId.Query
            {
                MovieCollectionId = movieCollectionId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };

            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla listy filmowej o ID '{movieCollectionId}'.");
            }

            return Ok(reviews);
        }
        //Dodawanie recenzji listy filmowej
        [AllowAnonymous]
        [HttpPost("add-movie-collection-review")]
        public async Task<IActionResult> CreateCollectionReview([FromBody] CreateMovieCollectionReview.CreateMovieCollectionReviewCommand command)
        {
            try
            {
                var review = await Mediator.Send(command);
                return Ok(review);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Usuwanie recenzji listy filmowej
        [AllowAnonymous]
        [HttpDelete("delete-movie-collection-review/{id}")]
        public async Task<IActionResult> DeleteMovieCollectionReview(Guid id)
        {
            var result = await Mediator.Send(new DeleteMovieCollectionReview(id));

            if (result == null)
            {
                return NotFound($"Nie znaleziono recenzji kolekcji o ID: {id}");
            }

            return Ok(result);
        }
        //Edycja recenzji listy filmowej
        [AllowAnonymous]
        [HttpPut("edit-movie-collection-review/{id}")]
        public async Task<IActionResult> EditCollectionReview(Guid id, [FromBody] EditMovieCollectionReview.EditMovieCollectionReviewCommand command)
        {
            try
            {
                command.ReviewId = id;

                var review = await Mediator.Send(command);
                if (review == null)
                {
                    return NotFound($"Nie znaleziono recenzji kolekcji o ID: {id}");
                }

                return Ok(review);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
        }
    }
}
