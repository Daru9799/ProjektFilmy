using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.Entities
{
    public class Notification
    {
        public enum NotificationType
        {
            Invitation, //zaproszenie do znajomych
            MovieRelease, //film wychodzi
            PersonUpdate //cos nowego u osoby (rezyer, aktor)
        }
        public Guid NotificationId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public NotificationType Type { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public string Resource { get; set; }
        //Relacja miedzy tabela Users
        public string? SourceUserId { get; set; } //Nullable dla systemowych
        public string TargetUserId { get; set; }
        public User? SourceUser { get; set; }
        public User TargetUser { get; set; }
    }
}
