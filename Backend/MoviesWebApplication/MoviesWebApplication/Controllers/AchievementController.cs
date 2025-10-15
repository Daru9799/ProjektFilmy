using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Domain;
using Movies.Application.Achievements;
using Movies.Domain.DTOs;
using MoviesWebApplication.Common.Responses;
using MoviesWebApplication.Common;

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

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [Authorize]
        [HttpGet("by-user-name/{userName}")]
        public async Task<ActionResult<PagedResponse<UserAchievementDto>>> GetAchievementsByUserId(string userName, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "date", [FromQuery] string sortDirection = "desc")
        {
            var query = new AchievementsByUserName.Query
            {
                UserName = userName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy
            };
            //var request = await Mediator.Send(query);

            return await Mediator.SendWithTypedExceptionHandling(query);

        }


    }
}
