using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Users;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    //Tylko do testów
    public class UsersController : BaseApiController
    {
        [HttpGet("all")]
        [Authorize]
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
    }
}
