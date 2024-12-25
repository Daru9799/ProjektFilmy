using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class Category
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }

        //Kolekcja potrzebna do wygenerowania klucza obcego
        public ICollection<Movie> Movies { get; set; }
    }
}
