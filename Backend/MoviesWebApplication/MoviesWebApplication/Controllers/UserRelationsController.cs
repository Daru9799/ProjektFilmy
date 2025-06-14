﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.UserRelations;
using System.ComponentModel.DataAnnotations;
using Movies.Domain.DTOs;

namespace MoviesWebApplication.Controllers
{
    public class UserRelationsController : BaseApiController
    {
        //Dodawanie relacji
        [AllowAnonymous]
        [HttpPost("add-relation")]
        public async Task<IActionResult> CreateUserRelation([FromBody] CreateUserRelation.CreateUserRelationCommand command)
        {
            try
            {
                var relation = await Mediator.Send(command);
                return Ok("Pomyślnie dodano relacje.");
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Zwracanie relacji dla konkretnego uzytkownika (z możliwościa podania jakiego typu ma być "" -> zwróci wszystko)
        [Authorize]
        [HttpGet("by-username/{userName}")]
        public async Task<ActionResult<List<UserRelationDto>>> GetRelationsByUserName(string userName, [FromQuery] string type = "")
        {
            try
            {
                var query = new UserRelationsByUserName.Query
                {
                    UserName = userName,
                    Type = type
                };

                var relations = await Mediator.Send(query);

                if (relations == null)
                {
                    return NotFound($"Użytkownik '{userName}' nie istnieje.");
                }

                if (!relations.Any())
                {
                    return Ok(new List<UserRelationDto>());
                }

                return Ok(relations);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Wystąpił nieoczekiwany błąd: " + ex.Message);
            }
        }
        //Usuwanie relacji
        [Authorize]
        [HttpDelete("delete-relation/{id}")]
        public async Task<IActionResult> DeleteUserRelation(Guid id)
        {
            try
            {
                var result = await Mediator.Send(new DeleteUserRelation(id));

                if (result == null)
                {
                    return NotFound($"Nie znaleziono relacji o ID: {id}");
                }

                return Ok("Pomyślnie usunięto relacje.");
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("Nie masz uprawnień do usunięcia tej relacji.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Wystąpił błąd przy usuwaniu relacji: " + ex.Message);
            }
        }
    }
}
