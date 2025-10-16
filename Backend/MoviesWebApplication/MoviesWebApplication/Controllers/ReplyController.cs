using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Replies;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    public class ReplyController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-review-id/{reviewId}")]
        public async Task<ActionResult<PagedResponse<ReplyDto>>> GetRepliesByReviewId(Guid reviewId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var query = new GetRepliesByReviewId.Query
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
            var query = new GetNumberOfRepliesByReviewIds.Query { ReviewIds = reviewsIds };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }


        [Authorize]
        [HttpPost("add-review-reply")]
        public async Task<IActionResult> CreateReviewReply([FromBody] CreateReply.CreateReplyCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie stworzono komentarz");
        }

        //Usuwanie komentarza do recenzji
        [Authorize]
        [HttpDelete("delete-review-reply/{replyId}")]
        public async Task<IActionResult> DeleteReviewReply(Guid replyId)
        {
            var command = new DeleteReply.DeleteReplyCommand
            {
                ReplyId = replyId,
            };
            
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie usunięto komentarz.");
        }

        //Edycja komentarza do recenzji listy filmowej
        [Authorize]
        [HttpPut("edit-review-reply/{replyId}")]
        public async Task<IActionResult> EditReviewReply([FromRoute] Guid replyId, [FromBody] EditReplyRequestLocalDto request)
        {
            var command = new EditReply.EditReplyCommand
            {
                ReplyId = replyId,
                Comment = request.Comment
            };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie zmieniono komentarz.");
        }

        // Klasa DTO tylko dla body requestu
        public class EditReplyRequestLocalDto
        {
            [Required(ErrorMessage = "Treść komentarza jest wymagana")]
            [StringLength(1000, ErrorMessage = "Komentarz nie może przekraczać 1000 znaków")]
            public string Comment { get; set; }
        }

    }
}
