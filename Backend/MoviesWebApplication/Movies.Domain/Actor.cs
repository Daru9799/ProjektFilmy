using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class Actor
    {
        [Key]
        public Guid ActorId { get; set; }
        public string ActorName { get; set; }
        public string ActorLastName { get; set; }

        //Kolekcja potrzebna do wygenerowania klucza obcego
        public ICollection<Movie> Movies { get; set; }
    }
}
