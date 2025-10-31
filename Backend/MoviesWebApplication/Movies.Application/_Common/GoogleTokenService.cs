using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;

namespace Movies.Application._Common
{
    //Klasa do wyciągania access tokenu/refreshowania go
    public class GoogleTokenService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private readonly HttpClient _client;

        public GoogleTokenService(DataContext context, IConfiguration config, HttpClient client)
        {
            _context = context;
            _config = config;
            _client = client;
        }

        public async Task<string> GetValidAccessTokenAsync(string userId, CancellationToken cancellationToken)
        {
            var token = await _context.GoogleTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.User.Id == userId, cancellationToken);

            if (token == null)
            {
                return null;
            }

            //Jeśli ważny to zwraca token
            if (token.AccessTokenExpiresAt > DateTime.UtcNow.AddMinutes(1))
            {
                Console.WriteLine("Bez odświeżenia, access token był ważny!");
                return token.AccessToken;
            }

            //W innym wypadku używa refreshowania
            var refreshed = await RefreshTokenAsync(token, cancellationToken);

            _context.GoogleTokens.Update(refreshed);
            await _context.SaveChangesAsync(cancellationToken);

            return refreshed.AccessToken;
        }

        private async Task<GoogleTokenResponse> RefreshTokenAsync(GoogleTokenResponse oldToken, CancellationToken cancellationToken)
        {
            var clientId = _config["ClientId"];
            var clientSecret = _config["ClientSecret"];

            var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "client_id", clientId },
                { "client_secret", clientSecret },
                { "refresh_token", oldToken.RefreshToken },
                { "grant_type", "refresh_token" }
            });

            var response = await _client.PostAsync("https://oauth2.googleapis.com/token", content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var responseString = await response.Content.ReadAsStringAsync(cancellationToken);
            var newToken = JsonSerializer.Deserialize<GoogleTokenResponse>(responseString);

            oldToken.AccessToken = newToken.AccessToken;
            oldToken.ExpiresIn = newToken.ExpiresIn;
            oldToken.AccessTokenExpiresAt = DateTime.UtcNow.AddSeconds(newToken.ExpiresIn);
            oldToken.Scope = newToken.Scope ?? oldToken.Scope;
            oldToken.TokenType = newToken.TokenType ?? oldToken.TokenType;

            Console.WriteLine("Tu nastąpiło odświeżenie");
            return oldToken;
        }
    }
}
