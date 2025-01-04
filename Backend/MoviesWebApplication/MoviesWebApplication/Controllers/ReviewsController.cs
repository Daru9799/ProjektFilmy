using Microsoft.AspNetCore.Mvc;
using Movies.Application.Reviews;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class ReviewsController : BaseApiController
    {
        //Zwracanie wszystkich recenzji (przy uzyciu ReviewDto aby pozwracać dodatkowo UserId, UserName, MovieId i MovieTitle)
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<ReviewDto>>> GetReviews([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new ReviewsList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);
        }
        //Zwracanie recenzji na podstawie ID filmu
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsByMovieId(Guid movieId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new ReviewsByMovieId.Query 
            { 
                MovieId = movieId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla filmu o ID '{movieId}'.");
            }

            return Ok(reviews);
        }
        //Zwracanie recenzji na podstawie ID usera
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsByUserId(string userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new ReviewsByUserId.Query 
            { 
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla filmu o ID '{userId}'.");
            }

            return Ok(reviews);
        }
    }
}
