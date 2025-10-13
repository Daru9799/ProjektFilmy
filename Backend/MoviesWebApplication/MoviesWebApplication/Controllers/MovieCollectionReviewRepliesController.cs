using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollectionReviewReplies;
using Movies.Application.Replies;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Responses;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionReviewRepliesController : BaseApiController
    {
        //Zwracanie odpowiedzi dla podanej recenzji listy filmowej
        [AllowAnonymous]
        [HttpGet("by-review-id/{reviewId}")]
        public async Task<ActionResult<List<MovieCollectionReviewReplyDto>>> GetRepliesByMovieCollectionReviewId(Guid reviewId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var query = new RepliesByMovieCollectionReviewId.Query
            {
                ReviewId = reviewId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var replies = await Mediator.Send(query);

            if (replies.Data == null || !replies.Data.Any())
            {
                return NotFound(ApiResponse.NotFound($"Nie znaleziono komentarzy dla recenzji listy filmowej o ID '{reviewId}'."));
            }

            return Ok(replies);
        }

        [AllowAnonymous]
        [HttpGet("total-amount-by-review-ids")]
        public async Task<ActionResult<List<int>>> GetTotalAmountByReviewIds([FromQuery] List<Guid> reviewsIds = null)
        {
            var query = new GetNumberOfRepliesByMCReviewIds.Query { ReviewIds = reviewsIds };
            var replies = await Mediator.Send(query);
            if (replies == null || !replies.Any())
            {
                return NotFound(ApiResponse.NotFound("Nie znaleziono komentarzy dla podanych ID"));
            }
            return Ok(replies);
        }

        //Dodawanie nowego komentarza do recenzji listy filmowej
        [Authorize]
        [HttpPost("add-review-reply")]
        public async Task<IActionResult> CreateReviewReply([FromBody] CreateMovieCollectionReviewReply.CreateMovieCollectionReviewReplyCommand command)
        {
            try
            {
                var reply = await Mediator.Send(command);
                return Ok(reply);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ApiResponse.BadRequest(ex.Message));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex) 
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch(Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dodać komentarza do recenzji listy filmowej.\n{ex.Message}"));
            }
        }
        //Usuwanie komentarza do recenzji listy filmowej
        [Authorize]
        [HttpDelete("delete-review-reply/{id}")]
        public async Task<IActionResult> DeleteReviewReply(Guid id)
        {
            try
            {
                var result = await Mediator.Send(new DeleteMovieCollectionReviewReply(id));

                if (result == null)
                {
                    return NotFound(ApiResponse.NotFound($"Nie znaleziono komentarza o ID: {id}"));
                }

                return Ok("Pomyślnie usunięto komentarz.");
            }
            catch (UnauthorizedAccessException ex) 
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError(ex.Message));
            }
        }

        //Edycja komentarza do recenzji listy filmowej
        [Authorize]
        [HttpPut("edit-review-reply/{id}")]
        public async Task<IActionResult> EditReviewReply(Guid id, [FromBody] EditMovieCollectionReviewReply.EditMovieCollectionReviewReplyCommand command)
        {
            try
            {
                command.ReplyId = id;

                var reply = await Mediator.Send(command);

                if (reply == null)
                {
                    return NotFound(ApiResponse.NotFound($"Nie znaleziono komentarza o ID: {id}"));
                }

                return Ok(ApiResponse.Success());
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dokonać edycji komentarza. \n{ex.Message}"));
            }
        }
    }
}
