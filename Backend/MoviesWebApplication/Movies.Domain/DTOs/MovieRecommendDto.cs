using Movies.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class MovieRecommendDto
    {
        public Guid RecommendationId { get; set; }
        public int LikesCounter { get; set; }
        public Guid RecommendedMovieId { get; set; }
        public bool IsLiking { get; set; }
    }
}
