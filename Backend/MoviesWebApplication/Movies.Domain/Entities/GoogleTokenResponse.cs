using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Movies.Domain.Entities
{
    //Na potrzeby GoogleCalendar
    public class GoogleTokenResponse
    {
        [Key]
        public Guid TokenResponseId { get; set; }

        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; set; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; set; }

        [JsonPropertyName("scope")]
        public string Scope { get; set; }
        public DateTime AccessTokenExpiresAt { get; set; }

        //Klucze obce
        public User User { get; set; }
    }
}
