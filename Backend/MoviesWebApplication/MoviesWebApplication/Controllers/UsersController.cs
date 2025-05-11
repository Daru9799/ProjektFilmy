using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Users;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;

namespace MoviesWebApplication.Controllers
{
    //Tylko do testów
    public class UsersController : BaseApiController
    {
        [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            return await Mediator.Send(new UsersList.Query());
        }
        //Zwracanie wybranych danych usera 
        [AllowAnonymous]
        [HttpGet("by-username/{username}")]
        public async Task<ActionResult<UserProfileDto>> UserByUserName(string username)
        {
            var user = await Mediator.Send(new UserByUserName.Query { UserName = username });

            if (user == null)
            {
                return NotFound($"Użytkownik o nazwie '{username}' nie zostal odnaleziony.");
            }

            return Ok(user);
        }

        [Authorize]
        [HttpGet("statistics/{userId}")]
        public async Task<ActionResult<StatisticsDto>> StatistcsByUserId(Guid userId)
        {
            var statistics = await Mediator.Send(new UserStatisticsByUserId.Query { UserId = userId });

            if (statistics == null)
            {
                return NotFound($"Nie znaleziono użytkownika o Id: {userId}");
            }

            return Ok(statistics);
        }

        [Authorize]
        [HttpPatch("change-role/{userId}")]
        public async Task<IActionResult> ChangeUserRole(string userId, [FromBody] ChangeUserRoleDto dto)
        {
            var command = new EditUserRole.Command
            {
                UserId = userId,
                NewRole = dto.NewRole
            };

            var result = await Mediator.Send(command);

            if (!result)
            {
                return BadRequest("Nie udało się zmienić roli użytkownika. Sprawdź czy użytkownik lub podana rola istnieją.");
            }

            return Ok("Rola została zmieniona.");
        }
    }
}
