using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Entities
{
    public class MovieCollectionReviewReply
    {
        [Key]
        public Guid ReplyId { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; }
        //Obiekty potrzebne do wygenerowania kluczy obcych (relacja 1:wielu)
        public User User { get; set; }
        public MovieCollectionReview Review { get; set; } //Odpowiedź do recenzji kolekcji
    }
}
