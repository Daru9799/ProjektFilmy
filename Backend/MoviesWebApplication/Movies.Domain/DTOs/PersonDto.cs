using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class PersonDto
    {
        public Guid PersonId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Bio { get; set; }
        public DateTime BirthDate { get; set; }
        public string PhotoUrl { get; set; }
        //Dodatkowe pola
        public int TotalMovies { get; set; } //W kontekście bycia np rezyserem badz aktorem nie calosciowo
        public string FavoriteGenre { get; set; } //Podobnie jak wyzej ulubiony gatunek w konkretnej roli
    }
}
