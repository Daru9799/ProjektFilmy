using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Movies.Domain
{
    public class User : IdentityUser
    {
        public enum Role
        {
            User,   //Zwykły użytkownik
            Critic, //Krytyk
            Mod     //Moderator
        }
        public Role UserRole { get; set; }

        //Kolekcje potrzebne do wygenerowania kluczy obcych (relacja 1:wielu)
        public ICollection<Review> Reviews { get; set; }

    }
}
