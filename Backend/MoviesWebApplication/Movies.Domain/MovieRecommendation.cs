using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain
{
    public class MovieRecommendation
    {
        [Key]
        public Guid RecommendationId { get; set; }
        public int LikesCounter { get; set; } = 0;

        //Film do którego dodajemy rekomendację
        public Movie Movie { get; set; }
        //Film rekomendowany
        public Movie RecommendedMovie { get; set; }
        //Zdefiniowanie nazw kluczów obcych (przypisanie na poziomie DataContext jest)
        public Guid MovieId { get; set; }
        public Guid RecommendedMovieId { get; set; }
        public ICollection<User> LikedByUsers { get; set; }

    }
}
