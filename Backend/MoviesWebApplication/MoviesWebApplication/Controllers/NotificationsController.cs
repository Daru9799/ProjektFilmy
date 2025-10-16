using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Notifications;
using Movies.Domain;
using Movies.Domain.DTOs;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    public class NotificationsController : BaseApiController
    {
        //Zwracanie powiadomień na podstawie id usera
        [Authorize]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<PagedResponse<NotificationDto>>> GetNotificationsByUserId(string userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string orderBy = "date", [FromQuery] string sortDirection = "desc", [FromQuery] bool? isRead = null, [FromQuery] string type = null, [FromQuery] bool noPagination = false, [FromQuery] string sourceUserName = null)
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
            return await Mediator.SendWithTypedExceptionHandling(query);

        }
        //Dodawanie powiadomień do bazy
        [AllowAnonymous]
        [HttpPost("add-notification")]
        public async Task<IActionResult> CreateNotification([FromBody] CreateNotification.CreateNotificationCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Powiadomienie zostało pomyślnie dodane.");
        }

        //Usuwanie powiadomień z bazy
        [Authorize]
        [HttpDelete("delete-notification/{id}")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var command = new DeleteNotification(id);
            
            return await Mediator.SendWithExceptionHandling(command, "Powiadomienie zostało pomyślnie usunięte.");
        }

        //Nadpisanie czy powiadomienie zostało odczytane
        [Authorize]
        [HttpPatch("update-isread/{id}")]
        public async Task<IActionResult> UpdateIsRead(Guid id, [FromBody] UpdateNotificationReadStatus.Command command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Status przeczytania został zaktualizowany.");
        }
    }
}
