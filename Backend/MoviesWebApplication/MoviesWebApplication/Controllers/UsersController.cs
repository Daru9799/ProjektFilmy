using Microsoft.AspNetCore.Mvc;
using Movies.Application.Users;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    //Tylko do testów
    public class UsersController : BaseApiController
    {
        [HttpGet("all")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            return await Mediator.Send(new UsersList.Query());
        }
    }
}
