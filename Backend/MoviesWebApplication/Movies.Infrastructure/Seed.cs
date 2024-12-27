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
            context.Directors.RemoveRange(context.Directors);
            context.Actors.RemoveRange(context.Actors);
            context.Reviews.RemoveRange(context.Reviews);
            await context.SaveChangesAsync();*/


            // jeśli baza ma jakieś rekordy to nic nie rób
            if (context.Movies.Any()) return;

            //Kraje
            var usa = new Country
            {
                CountryName = "USA"
            };

            //Gatunki
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

            //Reżyserowie
            var director1 = new Director
            {
                DirectorName = "Joss Whedon" 
            };

            var director2 = new Director
            {
                DirectorName = "Robert Zemeckis" 
            };

            var director3 = new Director
            {
                DirectorName = "Christopher Nolan"
            };

            //Aktorzy
            var actor1 = new Actor
            {
                ActorId = Guid.NewGuid(),
                ActorName = "Robert",
                ActorLastName = "Downey Jr."
            };

            var actor2 = new Actor
            {
                ActorId = Guid.NewGuid(),
                ActorName = "Tom",
                ActorLastName = "Hanks"
            };

            var actor3 = new Actor
            {
                ActorId = Guid.NewGuid(),
                ActorName = "Christian",
                ActorLastName = "Bale"
            };

            var actor4 = new Actor
            {
                ActorId = Guid.NewGuid(),
                ActorName = "Scarlett",
                ActorLastName = "Johansson"
            };

            var actor5 = new Actor
            {
                ActorId = Guid.NewGuid(),
                ActorName = "Morgan",
                ActorLastName = "Freeman"
            };

            //Filmy
            var movies = new List<Movie>
            {
                new Movie
                {
                    Title = "The Avengers",
                    ReleaseDate = new DateTime(2012, 4, 26),
                    PosterUrl = "https://example.com/avengers-poster.jpg",
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { action, comedy },
                    Directors = new List<Director> { director1 },
                    Actors = new List<Actor> { actor1, actor4 }
                },
                new Movie
                {
                    Title = "Forrest Gump",
                    ReleaseDate = new DateTime(1994, 7, 6),
                    PosterUrl = "https://example.com/forrest-gump-poster.jpg",
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { drama, comedy },
                    Directors = new List<Director> { director2 },
                    Actors = new List<Actor> { actor2, actor5 }
                },
                new Movie
                {
                    Title = "The Dark Knight",
                    ReleaseDate = new DateTime(2008, 7, 18),
                    PosterUrl = "https://example.com/dark-knight-poster.jpg",
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { action, drama },
                    Directors = new List<Director> { director3 },
                    Actors = new List<Actor> { actor3 }
                }
            };

            //Recenzje
            var review1 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Niesamowite połączenie akcji i humoru. Znakomita obsada i świetna reżyseria Jossa Whedona. Czekałem na tę produkcję i nie zawiodłem się!",
                Movie = movies.First(m => m.Title == "The Avengers")
            };

            var review2 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5f,
                Comment = "Klasyka! Forrest Gump to film, który wzrusza za każdym razem. Tom Hanks w swojej najlepszej roli. Historia pełna emocji i niezapomnianych momentów.",
                Movie = movies.First(m => m.Title == "Forrest Gump")
            };

            var review3 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Jeden z najlepszych filmów o Batmanie! Świetna rola Heath'a Ledgera jako Jokera. Christopher Nolan stworzył naprawdę niezapomnianą produkcję.",
                Movie = movies.First(m => m.Title == "The Dark Knight")
            };

            var reviews = new List<Review>
            {
                review1,
                review2,
                review3
            };

            // załadowanie danych do pamięci
            context.Countries.Add(usa);
            context.Categories.AddRange(action, drama, comedy);
            context.Actors.AddRange(actor1, actor2, actor3, actor4, actor5);
            context.Directors.AddRange(director1, director2, director3);
            await context.Movies.AddRangeAsync(movies);
            await context.Reviews.AddRangeAsync(reviews);
            // dodanie rekordów do bazy danych
            await context.SaveChangesAsync();
        }
    }
}
