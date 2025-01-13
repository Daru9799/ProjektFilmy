using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Countries;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    [AllowAnonymous]
    public class CountriesController : BaseApiController
    {
        //Zwracanie wszystkich krajów
        [HttpGet("all")]
        public async Task<ActionResult<List<Country>>> GetCountries()
        {
            return await Mediator.Send(new CountriesList.Query());
        }
        // Zwracanie krajów na podstawie ID filmu
        [HttpGet("by-movie-id/{movieId}")]
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
    }
}
