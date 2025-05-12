using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollectionReviewReplies;
using Movies.Domain.DTOs;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionReviewRepliesController : BaseApiController
    {
        //Zwracanie odpowiedzi dla podanej recenzji listy filmowej
        [AllowAnonymous]
        [HttpGet("by-movie-collection-review-id/{reviewId}")]
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
                return NotFound($"Nie znaleziono komentarzy dla recenzji listy filmowej o ID '{reviewId}'.");
            }

            return Ok(replies);
        }
        //Dodawanie nowej odpowiedzi
        [AllowAnonymous]
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
                return BadRequest(ex.Message);
            }
        }
    }
}
