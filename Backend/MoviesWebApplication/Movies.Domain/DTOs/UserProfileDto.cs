using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Movies.Domain.Entities;

namespace Movies.Domain.DTOs
{
    //Model do zwracania profilów użytkowników
    public class UserProfileDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; } 
        public User.Role UserRole { get; set; } 
        //Nowe pola
        public int ReviewsCount { get; set; } //Liczba dodanych recenzji
        public bool IsOwner { get; set; } //Pole czy user jest wlascicielem tego profilu
        public bool IsGoogleUser { get; set; } //Pole czy user ma konto tworzone przez autentykacje google
        public string RelationType { get; set; } //Zwroci typ relacji w jakiej jest zalogowany user z danym userem, dostepne to: [None, Friend, Blocked]
        public Guid? RelationId { get; set; } //Id relacji (jeśli istnieje)
    }
}
