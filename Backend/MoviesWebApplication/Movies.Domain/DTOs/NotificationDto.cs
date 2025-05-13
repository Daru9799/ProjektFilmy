using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class NotificationDto
    {
        public Guid NotificationId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public string Resource { get; set; }
        public string SourceUserId { get; set; }
        public string SourceUserName { get; set; }
    }
}
