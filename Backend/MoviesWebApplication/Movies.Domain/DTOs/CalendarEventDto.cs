using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class CalendarEventDto
    {
        public string Summary { get; set; }
        public string Description { get; set; } //Bardziej jako Informacje dodatkowe czy coś takiego
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string EventType { get; set; } //Do wyboru w select: "Kino" / "Streaming". Wrzucony w Summary w kalendarzu
        public string? MovieId { get; set; } //Id filmu (moze byc uzyteczne i ulatwiac robote na froncie w przyszłości)
        public List<string>? AttendeesEmails { get; set; } //Opcjonalni uczestnicy (w sumie fajna opcja do wykorzystania listy znajomych do tego)

        /// Do lokalizacji google Places Autocomplete (tak naprawde leci LocationName i locationAdress, szer. geograficzne są opcjonalne zeby np wykorzystac w aplikacji kiedys)
        public string? LocationName { get; set; }
        public string? LocationAddress { get; set; }
        //public double? Latitude { get; set; }
        //public double? Longitude { get; set; }
    }
}
