using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class ReviewDto
    {
        public Guid ReviewId { get; set; }
        public string Comment { get; set; }
        public float Rating { get; set; }
        public string Username { get; set; }
        public string MovieTitle { get; set; }
        public string UserId { get; set; }
        public Guid MovieId { get; set; }
        //public string UserRole { get; set; }
        //public string Date { get; set; }
    }
}
