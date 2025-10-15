using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.Countries;
using Movies.Application.Movies;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    [AllowAnonymous]
    public class CountriesController : BaseApiController
    {
        //Zwracanie wszystkich krajów
        [HttpGet("all")]
        public async Task<ActionResult<List<Country>>> GetCountries()
        {
            return await Mediator.SendWithTypedExceptionHandling(new CountriesList.Query());
        }
        //Zwracanie krajów na podstawie ID filmu
        [HttpGet("by-movie-id/{movieId}")]
        public async Task<ActionResult<List<Country>>> GetCountriesByMovieId(Guid movieId)
        {
            return await Mediator.SendWithTypedExceptionHandling(new CountriesByMovieId.Query 
            { 
                MovieId = movieId 
            });
        }
    }
}
