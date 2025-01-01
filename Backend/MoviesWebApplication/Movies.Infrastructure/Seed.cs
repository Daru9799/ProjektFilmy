using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic.FileIO;
using Movies.Domain;

namespace Movies.Infrastructure
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<User> userManager)
        {
            //Usuwanie danych w tabelach jak chce sie coś na nowo wygenerowac nizej to nalezy to odkomentować
            /*context.Movies.RemoveRange(context.Movies);
            context.Countries.RemoveRange(context.Countries);
            context.Categories.RemoveRange(context.Categories);
            context.Directors.RemoveRange(context.Directors);
            context.Actors.RemoveRange(context.Actors);
            context.Reviews.RemoveRange(context.Reviews);
            context.Users.RemoveRange(context.Users);
            await context.SaveChangesAsync();*/

            //Tworzenie userów
            if (userManager.Users.Any()) return;

            var users = new List<User>
            {
                new User
                {
                    UserName = "user1",
                    Email = "user1@example.com",
                    UserRole = User.Role.User
                },
                new User
                {
                    UserName = "critic1",
                    Email = "critic1@example.com",
                    UserRole = User.Role.Critic
                },
                new User
                {
                    UserName = "mod1",
                    Email = "mod1@example.com",
                    UserRole = User.Role.Mod
                }
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Zaq12wsx");
            }

            // jeśli baza ma jakieś rekordy to nic nie rób
            if (context.Movies.Any()) return;

            //Kraje
            var usa = new Country
            {
                Name = "USA"
            };

            //Gatunki
            var action = new Category
            {
                Name = "Akcji"
            };

            var drama = new Category
            {
                Name = "Dramat"
            };

            var comedy = new Category
            {
                Name = "Komedia"
            };

            var director1 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Joss",
                LastName = "Whedon",
                Bio = "Joss Whedon to amerykański scenarzysta, reżyser i producent, znany głównie z tworzenia serialu 'Buffy: Postrach Wampirów' oraz reżyserowania 'Avengers'.",
                BirthDate = new DateTime(1964, 6, 23),
                PhotoUrl = "https://example.com/photos/joss_whedon.jpg"
            };

            var director2 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Robert",
                LastName = "Zemeckis",
                Bio = "Robert Zemeckis to amerykański reżyser filmowy, znany z takich filmów jak 'Powrót do przyszłości', 'Forrest Gump' czy 'Kto wrobił Królika Rogera'.",
                BirthDate = new DateTime(1951, 5, 14),
                PhotoUrl = "https://example.com/photos/robert_zemeckis.jpg"
            };

            var director3 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Christopher",
                LastName = "Nolan",
                Bio = "Christopher Nolan to brytyjsko-amerykański reżyser i producent, znany z takich filmów jak 'Incepcja', 'Trylogia Mroczny Rycerz' i 'Interstellar'.",
                BirthDate = new DateTime(1970, 7, 30),
                PhotoUrl = "https://example.com/photos/christopher_nolan.jpg"
            };

            // Aktorzy
            var actor1 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Robert",
                LastName = "Downey Jr.",
                Bio = "Robert Downey Jr. to amerykański aktor, najlepiej znany z roli Tony'ego Starka/Iron Mana w Marvel Cinematic Universe.",
                BirthDate = new DateTime(1965, 4, 4),
                PhotoUrl = "https://example.com/photos/robert_downey_jr.jpg"
            };

            var actor2 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Tom",
                LastName = "Hanks",
                Bio = "Tom Hanks to amerykański aktor i producent filmowy, znany z ról w filmach takich jak 'Forrest Gump', 'Cast Away' i 'Szeregowiec Ryan'.",
                BirthDate = new DateTime(1956, 7, 9),
                PhotoUrl = "https://example.com/photos/tom_hanks.jpg"
            };

            var actor3 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Christian",
                LastName = "Bale",
                Bio = "Christian Bale to brytyjsko-amerykański aktor, znany z intensywnych ról w filmach takich jak 'Mroczny Rycerz', 'American Psycho' i 'Mechanik'.",
                BirthDate = new DateTime(1974, 1, 30),
                PhotoUrl = "https://example.com/photos/christian_bale.jpg"
            };

            var actor4 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Scarlett",
                LastName = "Johansson",
                Bio = "Scarlett Johansson to amerykańska aktorka i producentka filmowa, znana z roli Czarnej Wdowy w Marvel Cinematic Universe.",
                BirthDate = new DateTime(1984, 11, 22),
                PhotoUrl = "https://example.com/photos/scarlett_johansson.jpg"
            };

            var actor5 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Gary",
                LastName = "Sinise",
                Bio = "Gary Sinise to amerykański aktor, reżyser i producent, znany z roli porucznika Dana Taylora w filmie 'Forrest Gump'. Posiada także bogatą karierę telewizyjną, w tym rolę w serialu 'CSI: NY'.",
                BirthDate = new DateTime(1955, 3, 17),
                PhotoUrl = "https://example.com/photos/gary_sinise.jpg"
            };

            //Filmy
            var movies = new List<Movie>
            {
                new Movie
                {
                    Title = "The Avengers",
                    ReleaseDate = new DateTime(2012, 4, 26),
                    PosterUrl = "https://xl.movieposterdb.com/20_10/2012/848228/xl_848228_9bc5bc2a.jpg",
                    Description = "Najpotężniejsi bohaterowie Ziemi muszą połączyć siły, aby powstrzymać inwazję obcych.",
                    Duration = 143,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { action, comedy },
                    Directors = new List<Director> { director1 },
                    Actors = new List<Actor> { actor1, actor4 }
                },
                new Movie
                {
                    Title = "Forrest Gump",
                    ReleaseDate = new DateTime(1994, 7, 6),
                    PosterUrl = "https://xl.movieposterdb.com/12_04/1994/109830/xl_109830_58524cd6.jpg",
                    Description = "Prezydentury Kennedy'ego i Johnsona, wojna w Wietnamie, skandal Watergate i inne wydarzenia historyczne z perspektywy mężczyzny z Alabamy o niezwykłej podróży.",
                    Duration = 142,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { drama, comedy },
                    Directors = new List<Director> { director2 },
                    Actors = new List<Actor> { actor2, actor5 }
                },
                new Movie
                {
                    Title = "The Dark Knight",
                    ReleaseDate = new DateTime(2008, 7, 18),
                    PosterUrl = "https://xl.movieposterdb.com/08_06/2008/468569/xl_468569_fe24b125.jpg",
                    Description = "Batman staje do walki z Jokerem, mistrzem zbrodni, który pragnie wywołać chaos w Gotham City.",
                    Duration = 152,
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
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review2 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5f,
                Comment = "Klasyka! Forrest Gump to film, który wzrusza za każdym razem. Tom Hanks w swojej najlepszej roli. Historia pełna emocji i niezapomnianych momentów.",
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                User = users.First(u => u.UserName == "mod1")
            };

            var review3 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Jeden z najlepszych filmów o Batmanie! Świetna rola Heath'a Ledgera jako Jokera. Christopher Nolan stworzył naprawdę niezapomnianą produkcję.",
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                User = users.First(u => u.UserName == "user1")
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
