using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Application.Users;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using System.Security.Claims;

namespace MoviesWebApplication.Controllers
{
    //Tylko do testów
    public class UsersController : BaseApiController
    {
        //Potem wyłączyć (a najlepiej usunąć bo jest to endpoint testowy xD)
        [AllowAnonymous]
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

        [Authorize]
        [HttpPost("add-follow-person/{personId}")]
        public async Task<IActionResult> AddFollowToPerson(Guid personId)
        {
            try
            {
                // userId pobierane jest z Tokena
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Nieprawidłowy token: brak identyfikatora użytkownika." });
                }

                var command = new AddFollowToPerson.AddFollowToPersonCommand
                {
                    PersonId = personId,
                    UserId = userId,
                };

                var updatedCollection = await Mediator.Send(command);

                return Ok("Pomyślnie zaczęto obserwować osobę.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("delete-follow-person/{personId}")]
        public async Task<IActionResult> DeleteFollowFromPerson(Guid personId)
        {
            try
            {
                // userId pobierane jest z Tokena
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Nieprawidłowy token: brak identyfikatora użytkownika." });
                }

                var command = new DeleteFollowFromPerson.DeleteFollowFromPersonCommand
                {
                    PersonId = personId,
                    UserId = userId,
                };

                var updatedCollection = await Mediator.Send(command);

                return Ok("Pomyślnie przestano obserwować osobę");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("add-follow-movie/{movieId}")]
        public async Task<IActionResult> AddFollowToMovie(Guid movieId)
        {
            try
            {
                // userId pobierane jest z Tokena
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Nieprawidłowy token: brak identyfikatora użytkownika." });
                }

                var command = new AddFollowToMovie.AddFollowToMovieCommand
                {
                    MovieId = movieId,
                    UserId = userId,
                };

                var updatedCollection = await Mediator.Send(command);

                return Ok("Pomyślnie zaczęto obserwować film.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        
        [Authorize]
        [HttpDelete("delete-follow-movie/{movieId}")]
        public async Task<IActionResult> DeleteFollowFromMovie(Guid movieId)
        {
            try
            {
                // userId pobierane jest z Tokena
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Nieprawidłowy token: brak identyfikatora użytkownika." });
                }

                var command = new DeleteFollowFromMovie.DeleteFollowFromMovieCommand
                {
                    MovieId = movieId,
                    UserId = userId,
                };

                var updatedCollection = await Mediator.Send(command);

                return Ok("Pomyślnie przestano obserwować film");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
