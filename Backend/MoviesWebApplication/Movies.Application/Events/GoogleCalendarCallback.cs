using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application.Events
{
    //Zwraca tokeny
    public class GoogleCalendarCallback
    {
        public class Command : IRequest<object>
        {
            public string Code { get; set; }
            public string State { get; set; }
        }

        public class Handler : IRequestHandler<Command, object>
        {
            private readonly IConfiguration _config;
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;
            public Handler(IConfiguration config, DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _config = config;
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<object> Handle(Command request, CancellationToken cancellationToken)
            {
                var clientId = _config["ClientId"];
                var clientSecret = _config["ClientSecret"];
                var redirectUri = _config["RedirectUri"];

                using var client = new HttpClient();
                var content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "code", request.Code },
                    { "client_id", clientId },
                    { "client_secret", clientSecret },
                    { "redirect_uri", redirectUri },
                    { "grant_type", "authorization_code" }
                });

                var response = await client.PostAsync("https://oauth2.googleapis.com/token", content, cancellationToken);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync(cancellationToken);
                var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(responseString);

                //Weryfikacja usera
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier); ;
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                    throw new Exception("User not found.");

                //Sprawdzenie, czy ten użytkownik ma już token w bazie
                var existingToken = await _context.GoogleTokens.FirstOrDefaultAsync(t => t.User.Id == user.Id, cancellationToken);

                if (existingToken != null)
                {
                    existingToken.AccessToken = tokenResponse.AccessToken;
                    existingToken.RefreshToken = tokenResponse.RefreshToken;
                    existingToken.ExpiresIn = tokenResponse.ExpiresIn;
                    existingToken.AccessTokenExpiresAt = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn);
                    existingToken.TokenType = tokenResponse.TokenType;
                    existingToken.Scope = tokenResponse.Scope;
                }
                else
                {
                    _context.GoogleTokens.Add(new GoogleTokenResponse
                    {
                        TokenResponseId = Guid.NewGuid(),
                        AccessToken = tokenResponse.AccessToken,
                        RefreshToken = tokenResponse.RefreshToken,
                        ExpiresIn = tokenResponse.ExpiresIn,
                        AccessTokenExpiresAt = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn),
                        TokenType = tokenResponse.TokenType,
                        Scope = tokenResponse.Scope,
                        User = user
                    });
                }

                await _context.SaveChangesAsync(cancellationToken);

                //Przekierowanie
                var returnUrl = Encoding.UTF8.GetString(Convert.FromBase64String(request.State));
                return returnUrl;

            }
        }
    }
}
