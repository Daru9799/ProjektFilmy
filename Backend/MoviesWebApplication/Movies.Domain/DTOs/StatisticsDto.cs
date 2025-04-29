using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Domain.DTOs
{
    public class StatisticsDto
    {
        public double? HoursOfWathcedMovies { get; set; }
        public int? NumberOfWathcedMovies { get; set; }
        public int? NumberOfPlannedMovies { get; set; }
        public int? NumberOfReviews { get; set; }
        public PersonDto? FavoriteDirector { get; set; } // ewentualnie zmienic na samo imie+nazwisko+id
        public PersonDto? FavoriteActor { get; set; }

        public List<CategoryCountDto>? WatchedMoviesByCategory { get; set; }
        public List<CountryCountDto>? WatchedMoviesByCountry { get; set; }
        public List<RatingCountDto>? RatingDistribution { get; set; }

    }

    public class CategoryCountDto
    {
        public CategoryDto Category { get; set; } = default!; // ewnetualnie zmienic na samego string'a
        public int Count { get; set; }
    }

    public class CountryCountDto
    {
        public CountryDto Country { get; set; } = default!;
        public int Count { get; set; }
    }

    public class RatingCountDto
    {
        public float Rating { get; set; }
        public int Count { get; set; }
    }


}
