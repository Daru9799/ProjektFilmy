using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollectionReviews;
using Movies.Application.Movies;
using Movies.Application.Reviews;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionReviewsController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-movie-collection-id/{movieCollectionId}")]
        public async Task<ActionResult<PagedResponse<MovieCollectionReviewDto>>> GetReviewsByMovieCollectionId(Guid movieCollectionId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsByMovieCollectionId.Query
            {
                MovieCollectionId = movieCollectionId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [AllowAnonymous]
        [HttpGet("{reviewId}")]
        public async Task<ActionResult<MovieCollectionReviewDto>> GetCollectionReviewById(Guid reviewId)
        {
            var query = new GetCollectionReviewById.Query { Id = reviewId };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [AllowAnonymous]
        [HttpGet("by-userid-and-moviecollection-id")]
        public async Task<ActionResult<MovieCollectionReviewDto>> GetReviewByUserNameAndMovieId([FromQuery] string userId, [FromQuery] Guid movieCollectionId)
        {
            var query = new GetMCReviewByUserIdAndMCId.Query
            {
                UserId = userId,
                MovieCollectionId = movieCollectionId
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        //Dodawanie recenzji listy filmowej
        [Authorize]
        [HttpPost("add-movie-collection-review")]
        public async Task<IActionResult> CreateCollectionReview([FromBody] CreateMovieCollectionReview.CreateMovieCollectionReviewCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie dodano recenzje.");
        }

        //Usuwanie recenzji listy filmowej
        [Authorize]
        [HttpDelete("delete-movie-collection-review/{id}")]
        public async Task<IActionResult> DeleteMovieCollectionReview(Guid id)
        {
            return await Mediator.SendWithExceptionHandling(new DeleteMovieCollectionReview(id), "Pomyślnie usunięto recenzje.");
        }

        //Edycja recenzji listy filmowej
        [Authorize]
        [HttpPut("edit-movie-collection-review/{id}")]
        public async Task<IActionResult> EditCollectionReview(Guid id, [FromBody] EditMovieCollectionReview.EditMovieCollectionReviewCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie zmieniono recenzje.");
        }
    }
}
