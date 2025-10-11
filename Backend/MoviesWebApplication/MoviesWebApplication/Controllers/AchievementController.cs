using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain;
using Movies.Application.Achievements;
using Movies.Domain.DTOs;
using MoviesWebApplication.Responses;

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

            if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest(ApiResponse.BadRequest("Nieprawidłowe parametry paginacji. PageNumber i PageSize muszą być większe od 0, a PageSize nie może przekraczać 100."));
            }

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);
        }

        [Authorize]
        [HttpGet("by-user-name/{userName}")]
        public async Task<ActionResult<List<UserAchievementDto>>> GetAchievementsByUserId(string userName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "date", [FromQuery] string sortDirection = "desc")
        {
            var query = new AchievementsByUserName.Query
            {
                UserName = userName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };
            var request = await Mediator.Send(query);

            if (request.Data == null || !request.Data.Any())
            {
                return NotFound(ApiResponse.NotFound($"Nie znaleziono osiągnięć dla użytkowinka z ID '{userName}'."));
            }

            return Ok(request);
        }


    }
}
