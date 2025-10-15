using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollectionReviews;
using Movies.Application.Movies;
using Movies.Application.Reviews;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common.Responses;

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
                return NotFound(ApiResponse.NotFound($"Nie znaleziono recenzji dla listy filmowej o ID '{movieCollectionId}'."));
            }

            return Ok(reviews);
        }

        [AllowAnonymous]
        [HttpGet("{reviewId}")]
        public async Task<ActionResult<MovieCollectionReviewDto>> GetCollectionReviewById(Guid reviewId)
        {
            var querry = new GetCollectionReviewById.Query { Id = reviewId };
            var result = await Mediator.Send(querry);

            if (result == null)
            {
                return NotFound(ApiResponse.NotFound($"Nie znaleziono recenzji o ID: {reviewId}."));
            }

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("by-userid-and-moviecollection-id")]
        public async Task<ActionResult<ReviewDto>> GetReviewByUserNameAndMovieId([FromQuery] string userId, [FromQuery] Guid movieCollectionId)
        {
            var query = new GetMCReviewByUserIdAndMCId.Query
            {
                UserId = userId,
                MovieCollectionId = movieCollectionId
            };

            var review = await Mediator.Send(query);

            if (review == null)
            {
                return NotFound(ApiResponse.NotFound($"Nie znaleziono recenzji dla użytkownika o ID '{userId}' i filmu o ID '{movieCollectionId}'."));
            }

            return Ok(review);
        }

        //Dodawanie recenzji listy filmowej
        [Authorize]
        [HttpPost("add-movie-collection-review")]
        public async Task<IActionResult> CreateCollectionReview([FromBody] CreateMovieCollectionReview.CreateMovieCollectionReviewCommand command)
        {
            try
            {
                var review = await Mediator.Send(command);
                return Ok("Pomyślnie dodano recenzje.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dodać recenzji do listy filmowej.\n{ex.Message}"));
            }
        }
        //Usuwanie recenzji listy filmowej
        [Authorize]
        [HttpDelete("delete-movie-collection-review/{id}")]
        public async Task<IActionResult> DeleteMovieCollectionReview(Guid id)
        {
            try
            {
                var result = await Mediator.Send(new DeleteMovieCollectionReview(id));

                if (result == null)
                {
                    return NotFound(ApiResponse.NotFound($"Nie znaleziono recenzji kolekcji o ID: {id}"));
                }

                return Ok("Pomyślnie usunięto recenzje.");

            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się usunąć recenzji listy filmowej.\n{ex.Message}"));
            }

        }
        //Edycja recenzji listy filmowej
        [Authorize]
        [HttpPut("edit-movie-collection-review/{id}")]
        public async Task<IActionResult> EditCollectionReview(Guid id, [FromBody] EditMovieCollectionReview.EditMovieCollectionReviewCommand command)
        {
            try
            {
                command.ReviewId = id;

                var review = await Mediator.Send(command);
                if (review == null)
                {
                    return NotFound(ApiResponse.NotFound($"Nie znaleziono recenzji kolekcji o ID: {id}"));
                }

                return Ok("Pomyślnie zmieniono recenzje.");
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dokonać edycji recenzji. \n{ex.Message}"));
            }
        }
    }
}
