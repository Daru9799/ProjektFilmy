using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class MovieCollectionReviewReplyDto
    {
        public Guid ReplyId { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
        public string UserId { get; set; }
        public Guid ReviewId { get; set; }
        public bool IsOwner { get; set; }
    }
}
