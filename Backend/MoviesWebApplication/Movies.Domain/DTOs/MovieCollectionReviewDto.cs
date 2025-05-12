using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class MovieCollectionReviewDto
    {
        public Guid MovieCollectionReviewId { get; set; }
        public string Comment { get; set; }
        public float Rating { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
        public string UserId { get; set; }
        public bool Spoilers {  get; set; }
        public Guid MovieCollectionId { get; set; }
        public bool IsCritic { get; set; }
        public bool IsOwner { get; set; } = false;
    }
}
