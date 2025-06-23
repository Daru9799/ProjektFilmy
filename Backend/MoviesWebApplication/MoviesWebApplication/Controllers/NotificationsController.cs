using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Notifications;
using Movies.Domain.DTOs;

namespace MoviesWebApplication.Controllers
{
    public class NotificationsController : BaseApiController
    {
        //Zwracanie powiadomień na podstawie id usera
        [Authorize]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<NotificationDto>>> GetNotificationsByUserId(string userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string orderBy = "date", [FromQuery] string sortDirection = "desc", [FromQuery] bool? isRead = null, [FromQuery] string type = null, [FromQuery] bool noPagination = false, [FromQuery] string sourceUserName = null)
        {
            var query = new NotificationsByUserId.Query
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy,
                IsRead = isRead,
                Type = type,
                NoPagination = noPagination,
                SourceUserName = sourceUserName

            };

            var notifications = await Mediator.Send(query);

            if (notifications.Data == null || !notifications.Data.Any())
            {
                return NotFound($"Nie znaleziono powiadomień dla użytkownika o ID '{userId}'.");
            }

            return Ok(notifications);
        }
        //Dodawanie powiadomień do bazy
        [AllowAnonymous]
        [HttpPost("add-notification")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotification.CreateNotificationCommand command)
        {
            try
            {
                var result = await Mediator.Send(command);
                return Ok("Powiadomienie zostało pomyślnie dodane.");
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Usuwanie powiadomień z bazy
        [Authorize]
        [HttpDelete("delete-notification/{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var result = await Mediator.Send(new DeleteNotification(id));

            if (result == null)
            {
                return NotFound($"Nie znaleziono powiadomienia o ID: {id}");
            }

            return Ok("Powiadomienie zostało pomyślnie usunięte.");
        }

        //Nadpisanie czy powiadomienie zostało odczytane
        [Authorize]
        [HttpPatch("update-isread/{id}")]
        public async Task<IActionResult> UpdateIsRead(Guid id, [FromBody] UpdateNotificationReadStatus.Command command)
        {
            try
            {
                var result = await Mediator.Send(command);
                return Ok("Status przeczytania został zaktualizowany.");
            }
            catch (ValidationException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
