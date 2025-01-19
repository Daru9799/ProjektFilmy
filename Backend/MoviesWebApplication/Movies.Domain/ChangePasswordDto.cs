using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$", ErrorMessage = "Hasło musi mieć od 8 do 32 znaków, zawierać co najmniej jedną dużą literę, jedną małą literę i jedną cyfrę.")]
        public string NewPassword { get; set; }
    }
}
