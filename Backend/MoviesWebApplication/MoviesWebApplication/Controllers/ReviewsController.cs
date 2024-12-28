using Microsoft.AspNetCore.Mvc;
using Movies.Application.Reviews;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class ReviewsController : BaseApiController
    {
        //Zwracanie wszystkich recenzji (przy uzyciu ReviewDto aby pozwracać dodatkowo UserId, UserName, MovieId i MovieTitle)
        [HttpGet("all")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviews()
        {
            return await Mediator.Send(new ReviewsList.Query());
        }
        //Zwracanie recenzji na podstawie ID filmu
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsByMovieId(Guid movieId)
        {
            var query = new ReviewsByMovieId.Query { MovieId = movieId };
            var reviews = await Mediator.Send(query);

            if (reviews == null || !reviews.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla filmu o ID '{movieId}'.");
            }

            return Ok(reviews);
        }
        //Zwracanie recenzji na podstawie ID usera
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsByUserId(string userId)
        {
            var query = new ReviewsByUserId.Query { UserId = userId };
            var reviews = await Mediator.Send(query);

            if (reviews == null || !reviews.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla filmu o ID '{userId}'.");
            }

            return Ok(reviews);
        }
    }
}
