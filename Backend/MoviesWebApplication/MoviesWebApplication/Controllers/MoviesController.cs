using MediatR;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Application.Categories;
using Movies.Application.Countries;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MoviesWebApplication.Controllers
{
    public class MoviesController : BaseApiController
    {
        //ENDPOINTY
        //Zwracanie wszystkich filmów
        [HttpGet]
        public async Task<ActionResult<List<Movie>>> GetMovies()
        {
            return await Mediator.Send(new MoviesList.Query());
        }
        //Zwracanie filmu o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(Guid id)
        {
            return await Mediator.Send(new MoviesById.Query { Id = id });
        }
        //Zwracanie filmów na podstawie nazwy kraju
        [HttpGet("by-country/{countryName}")]
        public async Task<ActionResult<List<Movie>>> GetMoviesByCountry(string countryName)
        {
            var query = new MoviesByCountry.Query { CountryName = countryName };
            var movies = await Mediator.Send(query);
            if (movies == null || !movies.Any())
            {
                return NotFound($"Nie znaleziono filmów dla podanego kraju '{countryName}'.");
            }
            return Ok(movies);
        }
        //Zwracanie filmów na podstawie kategorii
        [HttpGet("by-category/{categoryName}")]
        public async Task<ActionResult<List<Movie>>> GetMoviesByCategory(string categoryName)
        {
            var query = new MoviesByCategory.Query { CategoryName = categoryName };
            var movies = await Mediator.Send(query);
            if (!movies.Any())
            {
                return NotFound($"Nie znaleziono filmów dla podanej kategorii '{categoryName}'.");
            }
            return Ok(movies);
        }
        //Zwracanie kategorii na podstawie id filmu
        [HttpGet("{movieId}/categories")]
        public async Task<ActionResult<List<Category>>> GetCategoriesByMovieId(Guid movieId)
        {
            var query = new CategoriesByMovieId.Query { MovieId = movieId };
            var categories = await Mediator.Send(query);

            if (categories == null || !categories.Any())
            {
                return NotFound($"Nie znaleziono kategorii dla filmu o ID '{movieId}'.");
            }

            return Ok(categories);
        }

        //Zwracanie krajów na podstawie id filmu
        [HttpGet("{movieId}/countries")]
        public async Task<ActionResult<List<Country>>> GetCountriesByMovieId(Guid movieId)
        {
            var query = new CountriesByMovieId.Query { MovieId = movieId };
            var countries = await Mediator.Send(query);

            if (countries == null || !countries.Any())
            {
                return NotFound($"Nie znaleziono krajów dla filmu o ID '{movieId}'.");
            }

            return Ok(countries);
        }
        //Dodawanie filmu
        [HttpPost]
        public async Task<ActionResult<Movie>> CreateMovie([FromBody] CreateMovie.Command command)
        {
            if (command == null)
            {
                return BadRequest("Nieprawidłowe dane wejściowe.");
            }
            // Wysłanie komendy do Mediatora
            var movie = await Mediator.Send(command);
            return Ok(movie);
        }


        //STARY KOD PRZED MEDIATOREM (MOZNA TO POTEM USUNAC)


        //ZAKOMENTOWANE ZWRACAJĄ BEZ POWIĄZANIA Z INNYMI TABELAMI (WTEDY OBIEKTY LIST COUNTRIES I CATEGORY SĄ NULL) PRAWDOPODOBNIE TAK BEDZIEMY ZWRACAC
        /*[HttpGet]
        public async Task<ActionResult<List<Movie>>> GetMovies()
        {
            return await _context.Movies
                             .Include(m => m.Countries)    //Ładuje powiązane kraje
                             .Include(m => m.Categories)   //Ładuje powiązane kategorie
                             .ToListAsync();
            //return await _context.Movies.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(Guid id)
        {
            return await _context.Movies
                                  .Include(m => m.Countries) //Ładuje powiązane kraje
                                  .Include(m => m.Categories) //Ładuje powiązane kategorie
                                  .FirstOrDefaultAsync(m => m.MovieId == id);
            //return await _context.Movies.FindAsync(id);
        }

        //UWAGA WIELKOSC LITER MA ZNACZENIE ("USA" ZNAJDUJE NATOMIAST "usa" NIE BO W BAZIE JEST Z DUZYCH, KATEGORIE TAKZE ZACZYNAJA SIE Z DUZEJ WIEC TYLOK TAK MOZNA JE ZNALEZC)
        [HttpGet("by-country/{countryName}")]
        public async Task<IActionResult> GetMoviesByCountry(string countryName)
        {
            var movies = await _context.Movies
                .Where(m => m.Countries.Any(c => c.CountryName == countryName))
                .ToListAsync();

            if (movies == null || !movies.Any())
            {
                return NotFound($"No movies found for the country '{countryName}'.");
            }

            return Ok(movies);
        }

        [HttpGet("by-category/{categoryName}")]
        public async Task<ActionResult<List<Movie>>> GetMoviesByCategory(string categoryName)
        {
            var movies = await _context.Movies
                                       .Where(m => m.Categories.Any(c => c.CategoryName == categoryName))
                                       .ToListAsync();

            if (!movies.Any())
            {
                return NotFound($"No movies found for the category '{categoryName}'.");
            }

            return Ok(movies);
        }*/

    }
}
