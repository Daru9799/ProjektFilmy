using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class PagedResponse<T>
    {
        public List<T> Data { get; set; } //Dane tzn np. lista filmów, gatunków etc.
        public int TotalItems { get; set; } //Łączna liczba elementów w bazie
        public int PageNumber { get; set; } //Aktualny numer strony
        public int PageSize { get; set; } //Liczba elementów na stronę
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize); //Maksymalna liczba stron
    }
}
