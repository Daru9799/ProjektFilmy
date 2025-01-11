using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class UserRegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        //Hasło ma mieć cyfre, duza i małą litere, 8 do 32 znaków
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$", ErrorMessage = "Hasło musi być złożone!")] 
        public string Password { get; set; }
        [Required]
        public string UserName { get; set; }
    }
}
