using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class ActorDto
    {
        public Guid ActorId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public DateTime BirthDate { get; set; }
        public string PhotoUrl { get; set; }
        //Dodatkowe pola
        public int TotalMovies { get; set; }
        public string FavoriteGenre { get; set; }
    }
}
