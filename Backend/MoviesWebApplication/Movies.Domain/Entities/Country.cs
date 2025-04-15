using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Movies.Domain.Entities
{
    public class Country
    {
        [Key]
        public Guid CountryId { get; set; }
        public string Name { get; set; }

        //Kolekcja potrzebna do wygenerowania klucza obcego
        public ICollection<Movie> Movies { get; set; }

    }
}
