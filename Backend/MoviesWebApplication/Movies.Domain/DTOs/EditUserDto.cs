using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class EditUserDto
    {
        public string? NewEmail { get; set; }
        public string? NewLogin { get; set; }
    }
}
