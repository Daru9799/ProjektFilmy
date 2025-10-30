using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MediatR;
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
            public async Task<object> Handle(Command request, CancellationToken cancellationToken)
            {
                var dto = request.EventDto;
                var client = new HttpClient();
                //Potem AccessToken będzie wyciągany z bazy danych
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", dto.AccessToken);

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
                            app = dto.AppTag,
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
