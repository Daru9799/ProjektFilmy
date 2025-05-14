using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MoviesWebApplication.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        //Przy nawiązaniu połączenia
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
                Console.WriteLine($"Użytkownik {userId} dołączył do grupy {userId}");
            }

            await base.OnConnectedAsync();
        }
        //Przy rozłączaniu
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
                Console.WriteLine($"Użytkownik {userId} opuścił grupę {userId}");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
