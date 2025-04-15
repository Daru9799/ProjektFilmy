using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic.FileIO;
using Movies.Domain.Entities;

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
            context.Reviews.RemoveRange(context.Reviews);
            context.Users.RemoveRange(context.Users);
            context.People.RemoveRange(context.People);
            context.MoviePeople.RemoveRange(context.MoviePeople);
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
            var usa = new Country { Name = "USA" };
            var uk = new Country { Name = "UK" };
            var canada = new Country { Name = "Kanada" };
            var germany = new Country { Name = "Niemcy" };
            var japan = new Country { Name = "Japonia" };
            var newZeland = new Country { Name = "Nowa Zelandia" };
            var southKorea = new Country { Name = "Korea Południowa" };

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

            var director1 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Joss",
                LastName = "Whedon",
                Bio = "Joss Whedon to amerykański scenarzysta, reżyser i producent, znany głównie z tworzenia serialu 'Buffy: Postrach Wampirów' oraz reżyserowania 'Avengers'.",
                BirthDate = new DateTime(1964, 6, 23),
                PhotoUrl = "https://fwcdn.pl/ppo/07/58/10758/451048_1.3.jpg"
            };

            var director2 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Robert",
                LastName = "Zemeckis",
                Bio = "Robert Zemeckis to amerykański reżyser filmowy, znany z takich filmów jak 'Powrót do przyszłości', 'Forrest Gump' czy 'Kto wrobił Królika Rogera'.",
                BirthDate = new DateTime(1951, 5, 14),
                PhotoUrl = "https://m.media-amazon.com/images/M/MV5BMTgyMTMzMDUyNl5BMl5BanBnXkFtZTcwODA0ODMyMw@@._V1_.jpg"
            };

            var director3 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Christopher",
                LastName = "Nolan",
                Bio = "Christopher Nolan to brytyjsko-amerykański reżyser i producent, znany z takich filmów jak 'Incepcja', 'Trylogia Mroczny Rycerz' i 'Interstellar'.",
                BirthDate = new DateTime(1970, 7, 30),
                PhotoUrl = "https://fwcdn.pl/ppo/08/96/40896/449999_1.3.jpg"
            };

            var director4 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Quentin",
                LastName = "Tarantino",
                Bio = "Quentin Tarantino to amerykański reżyser, znany z filmów takich jak 'Pulp Fiction', 'Kill Bill' i 'Django'.",
                BirthDate = new DateTime(1963, 3, 27),
                PhotoUrl = "https://m.media-amazon.com/images/M/MV5BMTgyMjI3ODA3Nl5BMl5BanBnXkFtZTcwNzY2MDYxOQ@@._V1_FMjpg_UX1000_.jpg"
            };
            var director5 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Steven",
                LastName = "Spielberg",
                Bio = "Steven Spielberg to jeden z najbardziej znanych reżyserów, twórca 'Jurassic Park', 'E.T.' i 'Szeregowiec Ryan'.",
                BirthDate = new DateTime(1946, 12, 18),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Steven_Spielberg_by_Gage_Skidmore.jpg/1200px-Steven_Spielberg_by_Gage_Skidmore.jpg"
            };
            var director6 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Peter",
                LastName = "Jackson",
                Bio = "Peter Jackson to nowozelandzki reżyser, znany z trylogii 'Władca Pierścieni' i 'Hobbit'.",
                BirthDate = new DateTime(1961, 10, 31),
                PhotoUrl = "https://fwcdn.pl/ppo/16/06/11606/450674_1.3.jpg"
            };
            var director7 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Greta",
                LastName = "Gerwig",
                Bio = "Greta Gerwig to reżyserka i aktorka, znana z 'Lady Bird' i 'Małych kobietek'.",
                BirthDate = new DateTime(1983, 8, 4),
                PhotoUrl = "https://cdn.britannica.com/89/213489-050-13BB1CF2/American-actress-director-screenwriter-Greta-Gerwig-2019.jpg"
            };

            var director8 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Bong",
                LastName = "Joon-ho",
                Bio = "Bong Joon-ho to południowokoreański reżyser, znany z filmów takich jak 'Snowpiercer' i 'Parasite'.",
                BirthDate = new DateTime(1969, 9, 14),
                PhotoUrl = "https://cdn.britannica.com/65/215265-050-A21B8163/Korean-director-Bong-Joon-Ho-2020.jpg"
            };

            // Aktorzy
            var actor1 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Robert",
                LastName = "Downey Jr.",
                Bio = "Robert Downey Jr. to amerykański aktor, najlepiej znany z roli Tony'ego Starka/Iron Mana w Marvel Cinematic Universe.",
                BirthDate = new DateTime(1965, 4, 4),
                PhotoUrl = "https://fwcdn.pl/ppo/00/31/31/449654_1.3.jpg"
            };

            var actor2 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Tom",
                LastName = "Hanks",
                Bio = "Tom Hanks to amerykański aktor i producent filmowy, znany z ról w filmach takich jak 'Forrest Gump', 'Cast Away' i 'Szeregowiec Ryan'.",
                BirthDate = new DateTime(1956, 7, 9),
                PhotoUrl = "https://fwcdn.pl/ppo/01/24/124/449666_1.3.jpg"
            };

            var actor3 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Christian",
                LastName = "Bale",
                Bio = "Christian Bale to brytyjsko-amerykański aktor, znany z intensywnych ról w filmach takich jak 'Mroczny Rycerz', 'American Psycho' i 'Mechanik'.",
                BirthDate = new DateTime(1974, 1, 30),
                PhotoUrl = "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_FMjpg_UX1000_.jpg"
            };

            var actor4 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Scarlett",
                LastName = "Johansson",
                Bio = "Scarlett Johansson to amerykańska aktorka i producentka filmowa, znana z roli Czarnej Wdowy w Marvel Cinematic Universe.",
                BirthDate = new DateTime(1984, 11, 22),
                PhotoUrl = "https://m.media-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_.jpg"
            };

            var actor5 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Gary",
                LastName = "Sinise",
                Bio = "Gary Sinise to amerykański aktor, reżyser i producent, znany z roli porucznika Dana Taylora w filmie 'Forrest Gump'. Posiada także bogatą karierę telewizyjną, w tym rolę w serialu 'CSI: NY'.",
                BirthDate = new DateTime(1955, 3, 17),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Gary_Sinise_2011_%28cropped%29.jpg/168px-Gary_Sinise_2011_%28cropped%29.jpg"
            };

            var actor6 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Leonardo",
                LastName = "DiCaprio",
                Bio = "Leonardo DiCaprio to amerykański aktor, znany z ról w 'Titanicu', 'Incepcji' i 'Wilku z Wall Street'.",
                BirthDate = new DateTime(1974, 11, 11),
                PhotoUrl = "https://media.themoviedb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg"
            };
            var actor7 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Natalie",
                LastName = "Portman",
                Bio = "Natalie Portman to aktorka, znana z ról w 'Czarnym Łabędziu', 'Leon: Zawodowiec' i 'Thor'.",
                BirthDate = new DateTime(1981, 6, 9),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Natalie_Portman_2019_San_Diego_Comic-Con.jpg/1200px-Natalie_Portman_2019_San_Diego_Comic-Con.jpg"
            };
            var actor8 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Denzel",
                LastName = "Washington",
                Bio = "Denzel Washington to amerykański aktor i reżyser, znany z ról w 'Treningu', 'Malcolmie X' i 'American Gangster'.",
                BirthDate = new DateTime(1954, 12, 28),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/e/ed/Denzel_Washington_cropped_02.jpg"
            };
            var actor9 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Emma",
                LastName = "Stone",
                Bio = "Emma Stone to aktorka, znana z ról w 'La La Land', 'Łatwo być mną' i 'Cruelli'.",
                BirthDate = new DateTime(1988, 11, 6),
                PhotoUrl = "https://m.media-amazon.com/images/M/MV5BMjI4NjM1NDkyN15BMl5BanBnXkFtZTgwODgyNTY1MjE@._V1_FMjpg_UX1000_.jpg"
            };
            var actor10 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Elijah",
                LastName = "Wood",
                Bio = "Elijah Wood to amerykański aktor, najbardziej znany z roli Froda Bagginsa w trylogii 'Władca Pierścieni'.",
                BirthDate = new DateTime(1981, 1, 28),
                PhotoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVNsReNMyL0G7Y2iMSZ7aqqusxj1hdw_tCNQ&s"
            };

            var actor11 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Ian",
                LastName = "McKellen",
                Bio = "Ian McKellen to brytyjski aktor teatralny i filmowy, znany z roli Gandalfa we 'Władcy Pierścieni' i Magneto w serii 'X-Men'.",
                BirthDate = new DateTime(1939, 5, 25),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/SDCC13_-_Ian_McKellen.jpg/800px-SDCC13_-_Ian_McKellen.jpg"
            };
            var actor12 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Song",
                LastName = "Kang-ho",
                Bio = "Song Kang-ho to południowokoreański aktor, znany z 'Parasite' i 'The Host'.",
                BirthDate = new DateTime(1967, 1, 17),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/d/df/Song_Gangho_2016.jpg"
            };
            var actor13 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Park",
                LastName = "So-Dam",
                Bio = "Park So-Dam to południowokoreańska aktorka, znana z roli w 'Parasite', gdzie zagrała sprytną i utalentowaną Kim Ki-Jung.",
                BirthDate = new DateTime(1991, 9, 8),
                PhotoUrl = "https://fwcdn.pl/ppo/93/78/2169378/455569_1.3.jpg"
            };
            var actor14 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Brad",
                LastName = "Pitt",
                Bio = "Brad Pitt to amerykański aktor i producent, znany z ról w 'Fight Club', 'Troi' i 'Siedem'.",
                BirthDate = new DateTime(1963, 12, 18),
                PhotoUrl = "https://fwcdn.pl/ppo/02/05/205/449687_1.3.jpg"
            };
            var actor15 = new Person
            {
                PersonId = Guid.NewGuid(),
                FirstName = "Steve",
                LastName = "Buscemi",
                Bio = "Steve Buscemi to amerykański aktor, reżyser i scenarzysta, znany z ról w filmach takich jak 'Wściekłe psy', 'Fargo' oraz 'Big Lebowski'.",
                BirthDate = new DateTime(1957, 12, 13),
                PhotoUrl = "https://upload.wikimedia.org/wikipedia/commons/9/90/Steve_Buscemi_2009_portrait.jpg"
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
                    Categories = new List<Category> { action, comedy }
                },
                new Movie
                {
                    Title = "Forrest Gump",
                    ReleaseDate = new DateTime(1994, 7, 6),
                    PosterUrl = "https://xl.movieposterdb.com/12_04/1994/109830/xl_109830_58524cd6.jpg",
                    Description = "Prezydentury Kennedy'ego i Johnsona, wojna w Wietnamie, skandal Watergate i inne wydarzenia historyczne z perspektywy mężczyzny z Alabamy o niezwykłej podróży.",
                    Duration = 142,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { drama, comedy }
                },
                new Movie
                {
                    Title = "The Dark Knight",
                    ReleaseDate = new DateTime(2008, 7, 18),
                    PosterUrl = "https://xl.movieposterdb.com/08_06/2008/468569/xl_468569_fe24b125.jpg",
                    Description = "Batman staje do walki z Jokerem, mistrzem zbrodni, który pragnie wywołać chaos w Gotham City.",
                    Duration = 152,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { action, drama }
                },
                new Movie{
                    Title = "Inception",
                    ReleaseDate = new DateTime(2010, 7, 16),
                    PosterUrl = "https://xl.movieposterdb.com/10_05/2010/1375666/xl_1375666_4ccc5247.jpg",
                    Description = "Film o złodziejach snów, którzy wchodzą do podświadomości swoich ofiar.",
                    Duration = 148,
                    Countries = new List<Country> { usa, uk },
                    Categories = new List<Category> { action, sciFi }
                },
                new Movie
                {
                    Title = "Jurassic Park",
                    ReleaseDate = new DateTime(1993, 6, 11),
                    PosterUrl = "https://xl.movieposterdb.com/12_10/1993/107290/xl_107290_6ddba2a8.jpg",
                    Description = "Naukowcy odtwarzają dinozaury, co prowadzi do katastrofalnych wydarzeń.",
                    Duration = 127,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { adventure, sciFi }
                },
                new Movie
                {
                    Title = "La La Land",
                    ReleaseDate = new DateTime(2016, 12, 25),
                    PosterUrl = "https://xl.movieposterdb.com/21_07/2016/3783958/xl_3783958_c239e260.jpg",
                    Description = "Historia miłości muzyka jazzowego i początkującej aktorki w Los Angeles.",
                    Duration = 128,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { musical, romance }
                },
                new Movie
                {
                    Title = "The Lord of the Rings: The Fellowship of the Ring",
                    ReleaseDate = new DateTime(2001, 12, 19),
                    PosterUrl = "https://xl.movieposterdb.com/22_06/2001/120737/xl_120737_0ff31144.jpg",
                    Description = "Drużyna musi przenieść Pierścień do Mordoru, by zniszczyć go w ogniu Góry Przeznaczenia.",
                    Duration = 178,
                    Countries = new List<Country> { newZeland, usa },
                    Categories = new List<Category> { adventure, drama }
                },
                new Movie
                {
                    Title = "The Lord of the Rings: The Two Towers",
                    ReleaseDate = new DateTime(2002, 12, 18),
                    PosterUrl = "https://xl.movieposterdb.com/24_06/2002/167261/xl_the-lord-of-the-rings-the-two-towers-movie-poster_28018e33.jpg",
                    Description = "Drużyna zostaje podzielona, ale każdy członek ma do odegrania kluczową rolę w walce z siłami zła.",
                    Duration = 179,
                    Countries = new List<Country> { newZeland, usa },
                    Categories = new List<Category> { adventure, drama }
                },
                new Movie
                {
                    Title = "The Lord of the Rings: The Return of the King",
                    ReleaseDate = new DateTime(2003, 12, 17),
                    PosterUrl = "https://xl.movieposterdb.com/22_11/2003/167260/xl_the-lord-of-the-rings-the-return-of-the-king-movie-poster_a977da10.jpg",
                    Description = "Ostateczna bitwa o Śródziemie i ostatni krok Froda, by zniszczyć Pierścień.",
                    Duration = 201,
                    Countries = new List<Country> { newZeland, usa },
                    Categories = new List<Category> { adventure, drama }
                },
                new Movie
                {
                    Title = "Parasite",
                    ReleaseDate = new DateTime(2019, 5, 30),
                    PosterUrl = "https://xl.movieposterdb.com/21_11/2019/6751668/xl_6751668_0d0409c5.jpg",
                    Description = "Rodzina Kim w nieoczekiwany sposób zmienia życie bogatej rodziny Parków, co prowadzi do napięcia i katastrofy.",
                    Duration = 132,
                    Countries = new List<Country> { southKorea },
                    Categories = new List<Category> { thriller, drama }
                },
                new Movie
                {
                    Title = "Django Unchained",
                    ReleaseDate = new DateTime(2012, 12, 25),
                    PosterUrl = "https://xl.movieposterdb.com/21_02/2012/1853728/xl_1853728_7fb18a9f.jpg",
                    Description = "Łowca nagród i były niewolnik łączą siły, aby uwolnić żonę tego drugiego i zemścić się na właścicielach plantacji.",
                    Duration = 165,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { drama, action, adventure }
                },
                new Movie
                {
                    Title = "Once Upon a Time in Hollywood",
                    ReleaseDate = new DateTime(2019, 7, 26),
                    PosterUrl = "https://xl.movieposterdb.com/20_04/2019/7131622/xl_7131622_d643f44a.jpg",
                    Description = "Aktor Rick Dalton i jego dubler Cliff Booth starają się odnaleźć w Hollywood lat 60. XX wieku, w tle wydarzeń związanych z morderstwami rodziny Mansonów.",
                    Duration = 161,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { drama, comedy }
                },
                new Movie
                {
                    Title = "Inglourious Basterds",
                    ReleaseDate = new DateTime(2009, 8, 21),
                    PosterUrl = "https://xl.movieposterdb.com/22_12/2009/361748/xl_inglourious-basterds-movie-poster_10cbca6a.jpg",
                    Description = "Grupa żydowskich żołnierzy amerykańskich planuje zamach na przywódców nazistowskich podczas premiery filmu w okupowanej Francji.",
                    Duration = 153,
                    Countries = new List<Country> { usa, germany },
                    Categories = new List<Category> { drama, action }
                },
                new Movie
                {
                    Title = "Reservoir Dogs",
                    ReleaseDate = new DateTime(1992, 10, 23),
                    PosterUrl = "https://xl.movieposterdb.com/22_12/2006/808446/xl_reservoir-dogs-movie-poster_e03b1f79.jpg",
                    Description = "Sześciu przestępców, nieznających swoich prawdziwych tożsamości, bierze udział w nieudanym napadzie na jubilera, co prowadzi do wzajemnej paranoi i odkrywania zdrajcy w grupie.",
                    Duration = 99,
                    Countries = new List<Country> { usa },
                    Categories = new List<Category> { drama, thriller }
                }
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

            //Dodanie osób do listy
            var people = new List<Person>
            {
                director1, 
                director2, 
                director3, 
                director4, 
                director5, 
                director6, 
                director7, 
                director8,
                actor1,
                actor2,
                actor3,
                actor4,
                actor5, 
                actor6,
                actor7,
                actor8,
                actor9,
                actor10,
                actor11,
                actor12,
                actor13,
                actor14,
                actor15
            };

            //ROLE
            //Aktorzy
            var movieActor1 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Fellowship of the Ring"),
                Person = actor10,
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor2 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Two Towers"),
                Person = actor10,
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor3 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Return of the King"),
                Person = actor10,
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor4 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Fellowship of the Ring"),
                Person = actor11,
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor5 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Two Towers"),
                Person = actor11,
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor6 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Return of the King"),
                Person = actor11,
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor7 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                Person = actor5, // Gary Sinise
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor8 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                Person = actor3, // Christian Bale
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor9 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Avengers"),
                Person = actor1, // Robert Downey Jr.
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor10 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Avengers"),
                Person = actor4, // Scarlett Johansson
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor11 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Inception"),
                Person = actor6, // Leonardo DiCaprio
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor12 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "La La Land"),
                Person = actor9, // Emma Stone
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor13 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                Person = actor2, // Tom Hanks
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor14 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Reservoir Dogs"),
                Person = actor15, // Steve Buscemi
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor15 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Parasite"),
                Person = actor12, // Song Kang-ho
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor16 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Parasite"),
                Person = actor13, // Park So-Dam
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor17 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Inglourious Basterds"),
                Person = actor14, // Brad Pitt
                Role = MoviePerson.PersonRole.Actor
            };

            var movieActor18 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Once Upon a Time in Hollywood"),
                Person = actor14, // Brad Pitt
                Role = MoviePerson.PersonRole.Actor
            };

            //przypisanie filmów dla reżyserów
            var movieDirector1 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Avengers"),
                Person = director1,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector2 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Forrest Gump"),
                Person = director2,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector3 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Dark Knight"),
                Person = director3,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector4 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Inception"),
                Person = director3,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector5 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Django Unchained"),
                Person = director4,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector6 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Once Upon a Time in Hollywood"),
                Person = director4,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector7 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Inglourious Basterds"),
                Person = director4,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector8 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Reservoir Dogs"),
                Person = director4,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector9 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Jurassic Park"),
                Person = director5,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector10 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Fellowship of the Ring"),
                Person = director6,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector11 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Two Towers"),
                Person = director6,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector12 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "The Lord of the Rings: The Return of the King"),
                Person = director6,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector13 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "La La Land"),
                Person = director7,
                Role = MoviePerson.PersonRole.Director
            };

            var movieDirector14 = new MoviePerson
            {
                MoviePersonId = Guid.NewGuid(),
                Movie = movies.First(m => m.Title == "Parasite"),
                Person = director8,
                Role = MoviePerson.PersonRole.Director
            };

            var moviePeople = new List<MoviePerson>
            {
                movieDirector1,
                movieDirector2,
                movieDirector3,
                movieDirector4,
                movieDirector5,
                movieDirector6,
                movieDirector7,
                movieDirector8,
                movieDirector9,
                movieDirector10,
                movieDirector11,
                movieDirector12,
                movieDirector13,
                movieDirector14,
                movieActor1,
                movieActor2,
                movieActor3,
                movieActor4,
                movieActor5, 
                movieActor6,
                movieActor7, 
                movieActor8,
                movieActor9, 
                movieActor10,
                movieActor11,
                movieActor12, 
                movieActor13,
                movieActor14,
                movieActor15,
                movieActor16,
                movieActor17,
                movieActor18,
            };

            // załadowanie danych do pamięci
            context.Countries.AddRange(usa, uk, canada, germany, japan, newZeland, southKorea);
            context.Categories.AddRange(action, drama, comedy, document, musical, horror, thriller, sciFi, romance ,adventure);
            await context.Movies.AddRangeAsync(movies);
            await context.Reviews.AddRangeAsync(reviews);
            //NOWE
            await context.People.AddRangeAsync(people);
            await context.MoviePeople.AddRangeAsync(moviePeople);
            // dodanie rekordów do bazy danych
            await context.SaveChangesAsync();
        }
    }
}
