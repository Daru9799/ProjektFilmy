using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Application.Reviews;
using Movies.Domain;

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

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);
        }
        //Zwracanie recenzji na podstawie ID filmu
        [AllowAnonymous]
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsByMovieId(Guid movieId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsByMovieId.Query
            {
                MovieId = movieId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };
            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla filmu o ID '{movieId}'.");
            }

            return Ok(reviews);
        }
        //Zwracanie recenzji na podstawie nazwy usera
        [AllowAnonymous]
        [HttpGet("by-username/{userName}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviewsByUserId(string userName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "year", [FromQuery] string sortDirection = "desc")
        {
            var query = new ReviewsByUserName.Query
            {
                UserName = userName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };
            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono recenzji dla użytkownika o podanej nazwie '{userName}'.");
            }

            return Ok(reviews);
        }
        //Dodawanie recenzji
        [Authorize]
        [HttpPost("add-review")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReview.CreateReviewCommand command)
        {
            try
            {
                var review = await Mediator.Send(command);
                return Ok(review); 
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Usuwanie recenzji
        [Authorize]
        [HttpDelete("delete-review/{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            //Wysyłanie komendy usunięcia recenzji do mediatora
            var result = await Mediator.Send(new DeleteReview(id));

            if (result == null)
            {
                return NotFound($"Nie znaleziono recenzji o ID: {id}");
            }

            return Ok(result);
        }
        //Edycja recenzji
        [Authorize]
        [HttpPut("edit-review/{id}")]
        public async Task<IActionResult> EditReview(Guid id, [FromBody] EditReview.EditReviewCommand command)
        {
            try
            {
                command.ReviewId = id;

                var review = await Mediator.Send(command);
                if (review == null)
                {
                    return NotFound($"Nie znaleziono recenzji o ID: {id}");
                }

                return Ok(review);
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Wystąpił błąd: {ex.Message}");
            }
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

            var review = await Mediator.Send(query);

            if (review == null)
            {
                return NotFound($"Nie znaleziono recenzji dla użytkownika '{userName}' i filmu o ID '{movieId}'.");
            }

            return Ok(review);
        }
    }
}
