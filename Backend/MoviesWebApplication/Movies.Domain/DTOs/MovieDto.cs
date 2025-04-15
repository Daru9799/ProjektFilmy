using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class MovieDto
    {
        public Guid MovieId { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string PosterUrl { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        //Dodatkowe pola
        public int ReviewsNumber { get; set; }
        public int ScoresNumber { get; set; }
        public float AverageScore { get; set; }
        //Kolekcja kategorii 
        public List<CategoryDto> Categories { get; set; }
        public List<CountryDto> Countries { get; set; }
        public List<PersonDto> Directors { get; set; }
    }
}
