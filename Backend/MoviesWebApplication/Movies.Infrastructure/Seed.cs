using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualBasic.FileIO;
using Movies.Domain;

namespace Movies.Infrastructure
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            //Usuwanie danych w tabelach
            /*context.Movies.RemoveRange(context.Movies);
            context.Countries.RemoveRange(context.Countries);
            context.Categories.RemoveRange(context.Categories);
            await context.SaveChangesAsync();*/


            // jeśli baza ma jakieś rekordy to nic nie rób
            if (context.Movies.Any()) return;

            var usa = new Country
            {
                CountryName = "USA"
            };

            var action = new Category
            {
                CategoryName = "Akcji"
            };

            var drama = new Category
            {
                CategoryName = "Dramat"
            };

            var comedy = new Category
            {
                CategoryName = "Komedia"
            };

            var movies = new List<Movie>
            {
                new Movie
            {
                Title = "The Avengers",
                ReleaseDate = new DateTime(2012, 4, 26),
                PosterUrl = "https://example.com/avengers-poster.jpg",
                Countries = new List<Country> { usa },
                Categories = new List<Category> { action, comedy }
            },
            new Movie
            {
                Title = "Forrest Gump",
                ReleaseDate = new DateTime(1994, 7, 6),
                PosterUrl = "https://example.com/forrest-gump-poster.jpg",
                Countries = new List<Country> { usa },
                Categories = new List<Category> { drama, comedy }
            },
            new Movie
            {
                Title = "The Dark Knight",
                ReleaseDate = new DateTime(2008, 7, 18),
                PosterUrl = "https://example.com/dark-knight-poster.jpg",
                Countries = new List<Country> { usa },
                Categories = new List<Category> { action, drama }
            }
            };

            // załadowanie danych do pamięci
            context.Countries.Add(usa);
            context.Categories.AddRange(action, drama, comedy);
            await context.Movies.AddRangeAsync(movies);
            // dodanie rekordów do bazy danych
            await context.SaveChangesAsync();
        }
    }
}
