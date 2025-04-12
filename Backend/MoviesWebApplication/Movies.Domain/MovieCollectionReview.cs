using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class MovieCollectionReview
    {
        [Key]
        public Guid MovieCollectionReviewId { get; set; }
        public float Rating { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; }
        public int LikesCounter { get; set; } = 0;
        public bool Spoilers { get; set; }
        //Obiekty potrzebne do wygenerowania kluczy obcych (relacja 1:wielu)
        public MovieCollection MovieCollection { get; set; }
        public User User { get; set; }
        public ICollection<MovieCollectionReviewReply> Replies { get; set; } //Polaczenie z kolekcja odpowiedzi do recenzji
    }
}
