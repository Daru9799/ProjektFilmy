using Microsoft.AspNetCore.Mvc;
using Movies.Application.Reviews;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class ReviewsController : BaseApiController
    {
        //Zwracanie wszystkich recenzji
        [HttpGet("all")]
        public async Task<ActionResult<List<Review>>> GetReviews()
        {
            return await Mediator.Send(new ReviewsList.Query());
        }
        //Zwracanie recenzji na podstawie ID filmu
        [HttpGet("{movieId}")]
        public async Task<ActionResult<List<Review>>> GetReviewsByMovieId(Guid movieId)
        {
            var query = new ReviewsByMovieId.Query { MovieId = movieId };
            var reviews = await Mediator.Send(query);

            if (reviews == null || !reviews.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla filmu o ID '{movieId}'.");
            }

            return Ok(reviews);
        }
    }
}
