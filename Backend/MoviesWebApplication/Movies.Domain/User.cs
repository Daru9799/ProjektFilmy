using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Movies.Domain
{
    public class User : IdentityUser
    {
        public enum Role
        {
            User,   //Zwykły użytkownik
            Critic, //Krytyk
            Mod     //Moderator
        }
        public Role UserRole { get; set; } = Role.User; //Ustawienie domyślnie roli user

        //Kolekcje potrzebne do wygenerowania kluczy obcych (relacja 1:wielu)
        public ICollection<Review> Reviews { get; set; }
        //Nowe
        public ICollection<MovieCollection> MovieCollections { get; set; }
        public ICollection<Reply> Replies { get; set; }
        public ICollection<UserAchievement> UserAchievements { get; set; }
        public ICollection<MovieCollectionReview> MovieCollectionReviews { get; set; }
        public ICollection<MovieCollectionReviewReply> MovieCollectionReviewReplies { get; set; }
        //RELACJE Z USERAMI (przyjaznie bloki)
        public ICollection<UserRelation> UserRelationsFrom { get; set; }
        public ICollection<UserRelation> UserRelationsTo { get; set; }
        //Powiadomienia wysyłane i odbierane
        public ICollection<Notification> UserNotificationFrom { get; set; }
        public ICollection<Notification> UserNotificationTo { get; set; }

    }
}
