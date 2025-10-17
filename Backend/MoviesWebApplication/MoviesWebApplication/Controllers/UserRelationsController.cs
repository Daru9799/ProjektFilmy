using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.UserRelations;
using System.ComponentModel.DataAnnotations;
using Movies.Domain.DTOs;
using MoviesWebApplication.Common;

namespace MoviesWebApplication.Controllers
{
    public class UserRelationsController : BaseApiController
    {
        //Dodawanie relacji
        [AllowAnonymous]
        [HttpPost("add-relation")]
        public async Task<IActionResult> CreateUserRelation([FromBody] CreateUserRelation.CreateUserRelationCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie stworzono relacje między użytkownikami.");
        }

        //Zwracanie relacji dla konkretnego uzytkownika (z możliwościa podania jakiego typu ma być "" -> zwróci wszystko)
        [Authorize]
        [HttpGet("by-username/{userName}")]
        public async Task<ActionResult<List<UserRelationDto>>> GetRelationsByUserName(string userName, [FromQuery] string type = "")
        {
            var query = new UserRelationsByUserName.Query
            {
                UserName = userName,
                Type = type
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }
        //Usuwanie relacji
        [Authorize]
        [HttpDelete("delete-relation/{id}")]
        public async Task<IActionResult> DeleteUserRelation(Guid id)
        {
            var command = new DeleteUserRelation(id);

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie usunięto relacje.");
        }    
    }
}
