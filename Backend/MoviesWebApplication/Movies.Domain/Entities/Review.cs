using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Movies.Domain.Entities
{
    public class Review
    {
        [Key]
        public Guid ReviewId { get; set; }
        public float Rating { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; }

        //Obiekty potrzebne do wygenerowania kluczy obcych (relacja 1:wielu)
        public Movie Movie { get; set; }
        public User User { get; set; }
        public ICollection<Reply> Replies { get; set; } //Polaczenie z kolekcja odpowiedzi do recenzji
    }
}
