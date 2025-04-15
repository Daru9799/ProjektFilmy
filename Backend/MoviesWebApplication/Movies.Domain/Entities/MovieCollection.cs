using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Entities
{
    public class MovieCollection
    {
        public enum VisibilityMode
        {
            Private,   //Prywatna
            Friends, //Tylko znajomi
            Public     //Publiczna
        }
        public enum CollectionType
        {
            Watched, //Lista obejrzanych
            Planned,    //Lista planowanych
            Custom    //Lista customowa
        }

        [Key]
        public Guid MovieCollectionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public VisibilityMode ShareMode { get; set; } = VisibilityMode.Private; //Ustawienie domyślnie jako prywatna 
        public bool AllowCopy { get; set; }
        public CollectionType Type { get; set; }
        public int LikesCounter { get; set; } = 0;

        //Obiekt potrzebny do wygenerowania kluczy obcych (relacja 1:wielu)
        public User User { get; set; }
        public ICollection<MovieCollectionReview> MovieCollectionReviews { get; set; }

        //Kolekcja do wygenerowania relacji (relacja wiele:wielu)
        public ICollection<Movie> Movies { get; set; }
    }
}
