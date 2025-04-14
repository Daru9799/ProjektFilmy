using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class MoviePerson
    {
        public enum PersonRole
        {
            Director,
            Actor
        }

        public Guid MoviePersonId { get; set; }
        public Movie Movie { get; set; }
        public Person Person { get; set; }
        public PersonRole Role { get; set; }

    }
}
