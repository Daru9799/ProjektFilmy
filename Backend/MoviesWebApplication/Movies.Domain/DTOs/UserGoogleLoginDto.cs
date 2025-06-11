using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class UserGoogleLoginDto
    {
        public string IdToken { get; set; }
        public string? UserName { get; set; } //Wymagane przy rejestracji
    }
}
