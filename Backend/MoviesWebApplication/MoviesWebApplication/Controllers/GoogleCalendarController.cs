using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json.Serialization;
using System.Net.Http.Headers;
using System.Text;
using Movies.Domain.Entities;
using Movies.Domain.DTOs;
using MediatR;
using Movies.Application.Events;
using MoviesWebApplication.Common;

namespace MoviesWebApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleCalendarController : BaseApiController
    {
        [Authorize]
        [HttpGet("connect")]
        public async Task<IActionResult> Connect([FromQuery] string returnUrl)
        {
            var result = await Mediator.Send(new GoogleCalendarConnect.Command { ReturnUrl = returnUrl });
            return Redirect(result);
        }

        [Authorize]
        [HttpGet("callback")]
        public async Task<IActionResult> GoogleCalendarCallback(string code, string state)
        {
            var returnUrl = await Mediator.Send(new GoogleCalendarCallback.Command
            {
                Code = code,
                State = state
            });

            return Redirect($"{returnUrl}?googleConnected=true");
        }

        [AllowAnonymous]
        [HttpPost("add")]
        public async Task<IActionResult> AddEvent([FromBody] CalendarEventDto dto)
        {
            var command = new CreateMovieEvent.Command { EventDto = dto };
            var createdEvent = await Mediator.SendWithExceptionHandling(command, "Wydarzenie dodane pomyślnie.");
            return Ok(createdEvent);
        }

        [AllowAnonymous]
        [HttpGet("all")]
        //Potem przerobic zeby access token byl brany z bazy a nie przesylany jako argument
        public async Task<IActionResult> GetAllEvents([FromQuery] string accessToken)
        {
            var query = new GetAllUserMovieEvents.Query
            {
                AccessToken = accessToken
            };

            var events = await Mediator.SendWithExceptionHandling(query, "Pobrano wydarzenia pomyślnie.");
            return Ok(events);
        }

        //POST
        //{
        //    "accessToken": "",
        //    "summary": "Noc filmowa z przyjaciółmi",
        //    "description": "Oglądamy klasyki sci-fi: Interstellar, Inception i Blade Runner. Każdy przynosi popcorn",
        //    "startDateTime": "2025-10-30T19:30:00Z",
        //    "endDateTime": "2025-10-31T03:00:00Z",
        //    "appTag": "Webfilm",
        //    "movieId": 872,
        //    "attendeesEmails": [
        //    "kuba.nowak@example.com",
        //    "ola.kowalska@example.com",
        //    "tomek.filmfan@gmail.com"
        //    ],
        //    "eventType": "Noc filmowa",
        //    "locationName": "Kino Helios Galeria Mokotów",
        //    "locationAddress": "ul. Wołoska 12, 02-675 Warszawa, Polska",
        //    "latitude": 52.1825,
        //    "longitude": 21.0023
        //}
    }
}
