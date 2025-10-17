using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Application.Reviews;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;

namespace MoviesWebApplication.Controllers
{
    public class ReviewsController : BaseApiController
    {
        //Zwracanie wszystkich recenzji (przy uzyciu ReviewDto aby pozwracać dodatkowo UserId, UserName, MovieId i MovieTitle)
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<ReviewDto>>> GetReviews([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        //Zwracanie recenzji na podstawie ID filmu
        [AllowAnonymous]
        [HttpGet("{reviewId}")]
        public async Task<ActionResult<ReviewDto>> GetReviewById(Guid reviewId)
        {
            var query = new GetReviewById.Query {Id = reviewId};

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [AllowAnonymous]
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<PagedResponse<ReviewDto>>> GetReviewsByMovieId(Guid movieId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsByMovieId.Query
            {
                MovieId = movieId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        //Zwracanie recenzji na podstawie nazwy usera
        [AllowAnonymous]
        [HttpGet("by-username/{userName}")]
        public async Task<ActionResult<PagedResponse<ReviewDto>>> GetReviewsByUserId(string userName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsByUserName.Query
            {
                UserName = userName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        //Dodawanie recenzji
        [Authorize]
        [HttpPost("add-review")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReview.CreateReviewCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie dodano recenzje.");
        }

        //Usuwanie recenzji
        [Authorize]
        [HttpDelete("delete-review/{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var command = new DeleteReview(id);

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie usunięto recenzje.");
        }

        //Edycja recenzji
        [Authorize]
        [HttpPut("edit-review/{id}")]
        public async Task<IActionResult> EditReview(Guid id, [FromBody] EditReview.EditReviewCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie zmieniono recenzje.");
        }

        //Zwracanie jednej recenzji na podstawie UserName i MovieId
        [Authorize]
        [HttpGet("by-username-and-movie-id")]
        public async Task<ActionResult<ReviewDto>> GetReviewByUserNameAndMovieId([FromQuery] string userName, [FromQuery] Guid movieId)
        {
            var query = new ReviewByUserNameAndMovieId.Query
            {
                UserName = userName,
                MovieId = movieId
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }
    }
}
