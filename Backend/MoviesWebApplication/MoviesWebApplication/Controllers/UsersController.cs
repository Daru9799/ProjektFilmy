using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.Application.Movies;
using Movies.Application.Users;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using System.Security.Claims;

namespace MoviesWebApplication.Controllers
{
    public class UsersController : BaseApiController
    {
        //Potem wyłączyć (a najlepiej usunąć bo jest to endpoint testowy)
        /*[AllowAnonymous]
        [HttpGet("all")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            return await Mediator.Send(new UsersList.Query());
        }*/

        //Zwracanie wybranych danych usera 
        [AllowAnonymous]
        [HttpGet("by-username/{username}")]
        public async Task<ActionResult<UserProfileDto>> UserByUserName(string username)
        {
            var query = new UserByUserName.Query { UserName = username };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [Authorize]
        [HttpGet("statistics/{userName}")]
        public async Task<ActionResult<StatisticsDto>> StatistcsByUserId(string userName)
        {
            var query = new UserStatisticsByUserName.Query { userName = userName };

            return await Mediator.SendWithTypedExceptionHandling(query);
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

            return await Mediator.SendWithExceptionHandling(command, "Rola użytkownika została zmieniona.");
        }
        [Authorize]
        [HttpGet("get-follow-person/{personId}")]
        public async Task<IActionResult> GetFollowPerson(Guid personId)
        {

            var command = new GetFollowByPersonId.Query { PersonId = personId };

            return await Mediator.SendWithExceptionHandling(command);
        }

        [Authorize]
        [HttpPost("add-follow-person/{personId}")]
        public async Task<IActionResult> AddFollowToPerson(Guid personId)
        {
 
            var command = new AddFollowToPerson.AddFollowToPersonCommand { PersonId = personId };

            return await Mediator.SendWithExceptionHandling(command);
        }

        [Authorize]
        [HttpDelete("delete-follow-person/{personId}")]
        public async Task<IActionResult> DeleteFollowFromPerson(Guid personId)
        {
            var command = new DeleteFollowFromPerson.DeleteFollowFromPersonCommand { PersonId = personId };

            return await Mediator.SendWithExceptionHandling(command);
        }

        //Sprawdza czy zalogowany user obserwuje dany film
        [Authorize]
        [HttpGet("get-follow-movie/{movieId}")]
        public async Task<IActionResult> GetFollowMovie(Guid movieId)
        {
            var command = new GetFollowByMovieId.Query { MovieId = movieId, };

            // Zwraca wartość typu bool
            return await Mediator.SendWithExceptionHandling(command);
        }

        [Authorize]
        [HttpPost("add-follow-movie/{movieId}")]
        public async Task<IActionResult> AddFollowToMovie(Guid movieId)
        {
            var command = new AddFollowToMovie.AddFollowToMovieCommand { MovieId = movieId };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie zaczęto obserwować film.");
        }

        
        [Authorize]
        [HttpDelete("delete-follow-movie/{movieId}")]
        public async Task<IActionResult> DeleteFollowFromMovie(Guid movieId)
        {
            var command = new DeleteFollowFromMovie.DeleteFollowFromMovieCommand { MovieId = movieId };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie przestano obserwować film");
        }
    }
}
