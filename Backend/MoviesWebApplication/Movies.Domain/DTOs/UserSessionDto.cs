using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    //Sesja bedzie zwracane po zalogowaniu
    public class UserSessionDto
    {
        public string UserName { get; set; }
        public string Token { get; set; }
    }
}
