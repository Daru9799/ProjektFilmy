using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Replies;
using Movies.Domain.DTOs;


namespace MoviesWebApplication.Controllers
{
    public class ReplyController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-review-id/{reviewId}")]
        public async Task<ActionResult<List<ReplyDto>>> GetRepliesByReviewId(Guid reviewId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var query = new GetRepliesByReviewId.Query
            {
                ReviewId = reviewId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var replies = await Mediator.Send(query);

            if (replies.Data == null || !replies.Data.Any())
            {
                return NotFound($"Nie znaleziono komentarzy dla recenzji o ID '{reviewId}'.");
            }

            return Ok(replies);
        }

        [Authorize]
        [HttpPost("add-review-reply")]
        public async Task<IActionResult> CreateReviewReply([FromBody] CreateReply.CreateReplyCommand command)
        {
            try
            {
                var reply = await Mediator.Send(command);
                return Ok("Pomyślnie dodano komentarz.");
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
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

            var result = await Mediator.Send(command);

            if (result == null)
            {
                return NotFound($"Nie znaleziono komentarza");
            }

            return Ok("Pomyślnie usunięto komentarz.");
        }

        //Edycja komentarza do recenzji listy filmowej
        [Authorize]
        [HttpPut("edit-review-reply/{replyId}")]
        public async Task<IActionResult> EditReviewReply(
                                        [FromRoute] Guid replyId,
                                        [FromBody] EditReplyRequestLocalDto request)
        {
            try
            {
                var command = new EditReply.EditReplyCommand
                {
                    ReplyId = replyId,
                    Comment = request.Comment
                };

                var reply = await Mediator.Send(command);

                return Ok("Pomyślnie zmieniono komentarz.");
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
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
