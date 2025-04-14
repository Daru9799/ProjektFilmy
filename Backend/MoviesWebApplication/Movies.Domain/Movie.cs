using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class Movie
    {
        [Key]
        public Guid MovieId { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string PosterUrl { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; } //W minutach

        //Kolekcje potrzebne do wygenerowania kluczy obcych (relacja wiele:wielu)
        public ICollection<Country> Countries { get; set; }
        public ICollection<Category> Categories { get; set; }
        public ICollection<MovieCollection> MovieCollections { get; set; }

        //Kolekcje potrzebne do wygenerowania kluczy obcych (relacja 1:wielu)
        public ICollection<Review> Reviews { get; set; }

        //Pod osoby kina
        public ICollection<MoviePerson> MoviePerson { get; set; }

    }
}
