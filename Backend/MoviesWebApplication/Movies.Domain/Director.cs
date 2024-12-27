using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Movies.Domain
{
    public class Director
    {
        [Key]
        public Guid DirectorId { get; set; }
        public string DirectorName { get; set; }

        //Kolekcja potrzebna do wygenerowania klucza obcego
        public ICollection<Movie> Movies { get; set; }
    }
}
