using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain;
using Movies.Application.Achievements;
using Movies.Domain.DTOs;

namespace MoviesWebApplication.Controllers
{
    public class AchievementController:BaseApiController
    {
        [AllowAnonymous] 
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<AchievementDto>>> GetAchievements([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new GetAllAchievements.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);
        }


        [AllowAnonymous]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<UserAchievementDto>>> GetAchievementsByUserId(Guid userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "date", [FromQuery] string sortDirection = "desc")
        {
            var query = new AchievementsByUserId.Query
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };
            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound($"Nie znaleziono osiągnięć dla użytkowinka z ID '{userId}'.");
            }

            return Ok(reviews);
        }


    }
}
