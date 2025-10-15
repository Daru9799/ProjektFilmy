using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Countries;
using Movies.Application.MovieCollectionReviewReplies;
using Movies.Application.Movies;
using Movies.Application.Replies;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionReviewRepliesController : BaseApiController
    {
        //Zwracanie odpowiedzi dla podanej recenzji listy filmowej
        [AllowAnonymous]
        [HttpGet("by-review-id/{reviewId}")]
        public async Task<ActionResult<PagedResponse<MovieCollectionReviewReplyDto>>> GetRepliesByMovieCollectionReviewId(Guid reviewId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var query = new RepliesByMovieCollectionReviewId.Query
            {
                ReviewId = reviewId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [AllowAnonymous]
        [HttpGet("total-amount-by-review-ids")]
        public async Task<ActionResult<List<int>>> GetTotalAmountByReviewIds([FromQuery] List<Guid> reviewsIds = null)
        {
            var query = new GetNumberOfRepliesByMCReviewIds.Query { ReviewIds = reviewsIds };
   
            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        //Dodawanie nowego komentarza do recenzji listy filmowej
        [Authorize]
        [HttpPost("add-review-reply")]
        public async Task<IActionResult> CreateReviewReply([FromBody] CreateMovieCollectionReviewReply.CreateMovieCollectionReviewReplyCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie dodano komentarz.");
        }

        //Usuwanie komentarza do recenzji listy filmowej
        [Authorize]
        [HttpDelete("delete-review-reply/{id}")]
        public async Task<IActionResult> DeleteReviewReply(Guid id)
        {
            return await Mediator.SendWithExceptionHandling(new DeleteMovieCollectionReviewReply(id), "Pomyślnie usunięto komentarz.");
        }

        //Edycja komentarza do recenzji listy filmowej
        [Authorize]
        [HttpPut("edit-review-reply/{id}")]
        public async Task<IActionResult> EditReviewReply(Guid id, [FromBody] EditMovieCollectionReviewReply.EditMovieCollectionReviewReplyCommand command)
        {
            
            command.ReplyId = id;

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie edytowano komentarz.");
        }
    }
}
