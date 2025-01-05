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
            /*
            context.Movies.RemoveRange(context.Movies);
            context.Countries.RemoveRange(context.Countries);
            context.Categories.RemoveRange(context.Categories);
            context.Directors.RemoveRange(context.Directors);
            context.Actors.RemoveRange(context.Actors);
            context.Reviews.RemoveRange(context.Reviews);
            context.Users.RemoveRange(context.Users);
            await context.SaveChangesAsync();
            */


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

            var uk = new Country { Name = "UK" };
            var canada = new Country { Name = "Canada" };
            var germany = new Country { Name = "Germany" };
            var japan = new Country { Name = "Japan" };

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

            var document = new Category
            {
                Name = "Dokumentalny"
            };

            var musical = new Category
            {
                Name = "Musical"
            };

            var horror = new Category
            {
                Name = "Horror"
            };

            var thriller = new Category { Name = "Thriller" };
            var sciFi = new Category { Name = "Science Fiction" };
            var romance = new Category { Name = "Romantyczny" };
            var adventure = new Category { Name = "Przygodowy" };

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

            var director4 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Quentin",
                LastName = "Tarantino",
                Bio = "Quentin Tarantino to amerykański reżyser, znany z filmów takich jak 'Pulp Fiction', 'Kill Bill' i 'Django'.",
                BirthDate = new DateTime(1963, 3, 27),
                PhotoUrl = "https://example.com/photos/quentin_tarantino.jpg"
            };
            var director5 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Steven",
                LastName = "Spielberg",
                Bio = "Steven Spielberg to jeden z najbardziej znanych reżyserów, twórca 'Jurassic Park', 'E.T.' i 'Szeregowiec Ryan'.",
                BirthDate = new DateTime(1946, 12, 18),
                PhotoUrl = "https://example.com/photos/steven_spielberg.jpg"
            };
            var director6 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Peter",
                LastName = "Jackson",
                Bio = "Peter Jackson to nowozelandzki reżyser, znany z trylogii 'Władca Pierścieni' i 'Hobbit'.",
                BirthDate = new DateTime(1961, 10, 31),
                PhotoUrl = "https://example.com/photos/peter_jackson.jpg"
            };
            var director7 = new Director
            {
                DirectorId = Guid.NewGuid(),
                FirstName = "Greta",
                LastName = "Gerwig",
                Bio = "Greta Gerwig to reżyserka i aktorka, znana z 'Lady Bird' i 'Małych kobietek'.",
                BirthDate = new DateTime(1983, 8, 4),
                PhotoUrl = "https://example.com/photos/greta_gerwig.jpg"
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

            var actor6 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Leonardo",
                LastName = "DiCaprio",
                Bio = "Leonardo DiCaprio to amerykański aktor, znany z ról w 'Titanicu', 'Incepcji' i 'Wilku z Wall Street'.",
                BirthDate = new DateTime(1974, 11, 11),
                PhotoUrl = "https://example.com/photos/leonardo_dicaprio.jpg"
            };
            var actor7 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Natalie",
                LastName = "Portman",
                Bio = "Natalie Portman to aktorka, znana z ról w 'Czarnym Łabędziu', 'Leon: Zawodowiec' i 'Thor'.",
                BirthDate = new DateTime(1981, 6, 9),
                PhotoUrl = "https://example.com/photos/natalie_portman.jpg"
            };
            var actor8 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Denzel",
                LastName = "Washington",
                Bio = "Denzel Washington to amerykański aktor i reżyser, znany z ról w 'Treningu', 'Malcolmie X' i 'American Gangster'.",
                BirthDate = new DateTime(1954, 12, 28),
                PhotoUrl = "https://example.com/photos/denzel_washington.jpg"
            };
            var actor9 = new Actor
            {
                ActorId = Guid.NewGuid(),
                FirstName = "Emma",
                LastName = "Stone",
                Bio = "Emma Stone to aktorka, znana z ról w 'La La Land', 'Łatwo być mną' i 'Cruelli'.",
                BirthDate = new DateTime(1988, 11, 6),
                PhotoUrl = "https://example.com/photos/emma_stone.jpg"
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
                },
                new Movie{
                    Title = "Inception",
                    ReleaseDate = new DateTime(2010, 7, 16),
                    PosterUrl = "https://xl.movieposterdb.com/10_05/2010/1375666/xl_1375666_4ccc5247.jpg",
                    Description = "Film o złodziejach snów, którzy wchodzą do podświadomości swoich ofiar.",
                    Duration = 148,
                    Countries = new List<Country> { usa, uk },
                    Categories = new List<Category> { action, sciFi },
                    Directors = new List<Director> { director3 },
                    Actors = new List<Actor> { actor6 }
                },
                new Movie
                {
                    Title = "Jurassic Park",
                    ReleaseDate = new DateTime(1993, 6, 11),
                    PosterUrl = "https://xl.movieposterdb.com/12_10/1993/107290/xl_107290_6ddba2a8.jpg",
                    Description = "Naukowcy odtwarzają dinozaury, co prowadzi do katastrofalnych wydarzeń.",
                    Duration = 127,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { adventure, sciFi },
                    Directors = new List<Director> { director5 },
                    Actors = new List<Actor> { actor6, actor7 }
                },
                new Movie
                {
                    Title = "La La Land",
                    ReleaseDate = new DateTime(2016, 12, 25),
                    PosterUrl = "https://xl.movieposterdb.com/21_07/2016/3783958/xl_3783958_c239e260.jpg",
                    Description = "Historia miłości muzyka jazzowego i początkującej aktorki w Los Angeles.",
                    Duration = 128,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { musical, romance },
                    Directors = new List<Director> { director7 },
                    Actors = new List<Actor> { actor9, actor7 }
                },
            };

            //Recenzje
            var review1 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Niesamowite połączenie akcji i humoru. Znakomita obsada i świetna reżyseria Jossa Whedona. Czekałem na tę produkcję i nie zawiodłem się!",
                Date = new DateTime(2023, 2, 1), 
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review2 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5f,
                Comment = "Klasyka! Forrest Gump to film, który wzrusza za każdym razem. Tom Hanks w swojej najlepszej roli. Historia pełna emocji i niezapomnianych momentów.",
                Date = new DateTime(2024, 12, 11),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                User = users.First(u => u.UserName == "critic1")
            };

            var review3 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Jeden z najlepszych filmów o Batmanie! Świetna rola Heath'a Ledgera jako Jokera. Christopher Nolan stworzył naprawdę niezapomnianą produkcję.",
                Date = new DateTime(2024, 3, 6),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                User = users.First(u => u.UserName == "user1")
            };

            var review4 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 3.0f,
                Comment = "Film był OK, ale spodziewałem się czegoś lepszego. Chociaż efekty specjalne były niesamowite, fabuła mogła być bardziej rozwinięta.",
                Date = new DateTime(2023, 6, 15),
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review5 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 2.5f,
                Comment = "Za dużo zamieszania i akcji, mało serca. Wydaje mi się, że film mógłby być krótszy i bardziej skondensowany.",
                Date = new DateTime(2023, 7, 20),
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review6 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5.0f,
                Comment = "Forrest Gump to film, który ma wszystko: emocje, humor, a także wiele lekcji życiowych. Tom Hanks w swojej życiowej roli!",
                Date = new DateTime(2023, 8, 5),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                User = users.First(u => u.UserName == "user1")
            };

            var review7 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.0f,
                Comment = "Bardzo solidna produkcja, chociaż nieco przewidywalna. Warto jednak obejrzeć, zwłaszcza dla fanów filmów akcji.",
                Date = new DateTime(2023, 9, 13),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                User = users.First(u => u.UserName == "user1")
            };

            var review8 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.0f,
                Comment = "Znakomita produkcja, ale kilka momentów mogłoby być lepiej dopracowanych. Jednak ogólnie warto obejrzeć.",
                Date = new DateTime(2023, 10, 18),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                User = users.First(u => u.UserName == "user1")
            };

            var review9 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Film jest niesamowity! Wspaniałe efekty specjalne i fantastyczna obsada. Na pewno wrócę do tego filmu nie raz.",
                Date = new DateTime(2024, 1, 2),
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review10 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 2.5f,
                Comment = "Nie jestem przekonany, mimo że film ma swoje momenty. Choć akcja jest intensywna, fabuła i postacie nie były dla mnie wystarczająco interesujące.",
                Date = new DateTime(2024, 2, 15),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                User = users.First(u => u.UserName == "user1")
            };

            var review11 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Zdecydowanie jeden z najlepszych filmów o Batmanie! Reżyseria Nolana robi swoje, a Ledger zagrał Jokera jak nikt inny.",
                Date = new DateTime(2024, 3, 1),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                User = users.First(u => u.UserName == "critic1")
            };

            var review12 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5.0f,
                Comment = "Absolutny klasyk, który nigdy się nie zestarzeje! Tom Hanks gra rolę, którą pamięta się przez całe życie. Wzrusza za każdym razem.",
                Date = new DateTime(2024, 4, 11),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                User = users.First(u => u.UserName == "critic1")
            };

            var review13 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 2.0f,
                Comment = "Szczerze mówiąc, film mnie zawiódł. Za dużo akcji, a za mało emocji i rozwoju postaci. Słaba fabuła.",
                Date = new DateTime(2024, 5, 22),
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review14 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Jeden z najlepszych filmów w swoim gatunku. Klimat, napięcie i genialna rola Ledgera! Szkoda, że nie ma więcej takich produkcji.",
                Date = new DateTime(2024, 6, 8),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                User = users.First(u => u.UserName == "user1")
            };

            var review15 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4f,
                Comment = "Wzruszający film, który ukazuje życie w całej jego okazałości. Bardzo poruszająca historia, a Tom Hanks w roli głównej to majstersztyk!",
                Date = new DateTime(2024, 7, 3),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                User = users.First(u => u.UserName == "user1")
            };

            var review16 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 1.5f,
                Comment = "Dobra produkcja, ale trochę przereklamowana. Głównie dla fanów superhero, reszta może poczuć się zawiedziona.",
                Date = new DateTime(2024, 8, 10),
                Movie = movies.First(m => m.Title == "The Avengers"),
                User = users.First(u => u.UserName == "user1")
            };

            var review17 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5.0f,
                Comment = "Fantastyczny i złożony film o podróżach w snach.",
                Date = new DateTime(2024, 9, 1),
                Movie = movies.First(m => m.Title == "Inception"),
                User = users.First(u => u.UserName == "user1")
            };

            var review18 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 4.5f,
                Comment = "Dinozaury powracają do życia! Ekscytujące od początku do końca.",
                Date = new DateTime(2024, 10, 1),
                Movie = movies.First(m => m.Title == "Jurassic Park"),
                User = users.First(u => u.UserName == "critic1")
            };

            var review19 = new Review
            {
                ReviewId = Guid.NewGuid(),
                Rating = 5.0f,
                Comment = "Piękna muzyka, wspaniała chemia między bohaterami. Cudowny film!",
                Date = new DateTime(2024, 11, 15),
                Movie = movies.First(m => m.Title == "La La Land"),
                User = users.First(u => u.UserName == "user1")
            };


            var reviews = new List<Review>
            {
                review1,
                review2,
                review3,
                review4,
                review5,
                review6,
                review7,
                review8,
                review9,
                review10,
                review11,
                review12,
                review13,
                review14,
                review15,
                review16,
                review17,
                review18,
                review19,
            };

            // załadowanie danych do pamięci
            context.Countries.AddRange(usa, uk, canada, germany, japan);
            context.Categories.AddRange(action, drama, comedy, document, musical, horror, thriller, sciFi, romance ,adventure);
            context.Actors.AddRange(actor1, actor2, actor3, actor4, actor5, actor6, actor7, actor8, actor9);
            context.Directors.AddRange(director1, director2, director3, director4, director5, director6, director7);
            await context.Movies.AddRangeAsync(movies);
            await context.Reviews.AddRangeAsync(reviews);
            // dodanie rekordów do bazy danych
            await context.SaveChangesAsync();
        }
    }
}
