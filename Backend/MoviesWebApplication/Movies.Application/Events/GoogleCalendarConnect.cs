using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Movies.Application.Events
{
    public class GoogleCalendarConnect
    {
        public class Command : IRequest<string>
        {
            public string ReturnUrl { get; set; }
        }

        public class Handler : IRequestHandler<Command, string>
        {
            private readonly IConfiguration _config;

            public Handler(IConfiguration config, IHttpContextAccessor httpContextAccessor)
            {
                _config = config;
            }

            public Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                var clientId = _config["ClientId"];
                var redirectUri = _config["RedirectUri"];

                //Serializacja i kodowanie adresu frontu do którego ma nastąpić powrót
                var stateEncoded = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(request.ReturnUrl));


                var authorizationUrl =
                    $"https://accounts.google.com/o/oauth2/v2/auth?" +
                    $"client_id={clientId}&" +
                    $"redirect_uri={redirectUri}&" +
                    $"response_type=code&" +
                    $"scope=https://www.googleapis.com/auth/calendar.events&" +
                    $"access_type=offline&" +
                    $"prompt=consent&" +
                    $"state={Uri.EscapeDataString(stateEncoded)}";

                return Task.FromResult(authorizationUrl);
            }
        }
    }
}
