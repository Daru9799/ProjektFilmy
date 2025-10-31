using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common;
using Movies.Application._Common.Exceptions;
using Movies.Domain.DTOs;

namespace Movies.Application.Events
{
    public class CreateMovieEvent
    {
        public class Command : IRequest<object> //W przypadku dodawania do bazy zmienic object na zdefiniowany objekt
        {
            public CalendarEventDto EventDto { get; set; }
        }

        public class Handler : IRequestHandler<Command, object>
        {
            private readonly GoogleTokenService _googleTokenService;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(GoogleTokenService googleTokenService, IHttpContextAccessor httpContextAccessor)
            {
                _googleTokenService = googleTokenService;
                _httpContextAccessor = httpContextAccessor;
            }
            public async Task<object> Handle(Command request, CancellationToken cancellationToken)
            {
                var dto = request.EventDto;

                var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                if (userId == null)
                    throw new UnauthorizedException("Użytkownik nie ma dostępu do tego zasobu");

                //Check tokenu
                var accessToken = await _googleTokenService.GetValidAccessTokenAsync(userId, cancellationToken);
                if(accessToken == null) 
                    throw new UnauthorizedException("Użytkownik nie ma powiązania z Kalendarzem Google");


                var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var eventData = new
                {
                    summary = $"[{dto.EventType}] {dto.Summary}",
                    description = dto.Description,
                    location = !string.IsNullOrEmpty(dto.LocationName)
                               ? $"{dto.LocationName} - {dto.LocationAddress}"
                               : dto.LocationAddress,
                    start = new { dateTime = dto.StartDateTime.ToString("o"), timeZone = "Europe/Warsaw" },
                    end = new { dateTime = dto.EndDateTime.ToString("o"), timeZone = "Europe/Warsaw" },
                    attendees = dto.AttendeesEmails?.Select(email => new { email }).ToList(),
                    extendedProperties = new
                    {
                        @private = new
                        {
                            app = "Webfilm",
                            movieId = dto.MovieId,
                            eventType = dto.EventType
                        }
                    }
                };

                var json = new StringContent(JsonSerializer.Serialize(eventData), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                    json,
                    cancellationToken
                );

                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<object>(responseString);
            }
        }
    }
}
