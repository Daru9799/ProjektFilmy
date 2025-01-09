using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class UserProfileDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; } 
        public User.Role UserRole { get; set; } 
        //Nowe pola
        public int ReviewsCount { get; set; } //Liczba dodanych recenzji
    }
}
