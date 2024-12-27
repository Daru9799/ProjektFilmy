﻿using Microsoft.AspNetCore.Mvc;
using Movies.Application.Categories;
using Movies.Application.Countries;
using Movies.Application.Movies;
using Movies.Domain;

namespace MoviesWebApplication.Controllers
{
    public class CategoriesController : BaseApiController
    {
        //Zwracanie wszystkich kategorii (gatunków)
        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetCountries()
        {
            return await Mediator.Send(new CategoriesList.Query());
        }
        // Zwracanie kategorii na podstawie ID filmu
        [HttpGet("{movieId}")]
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
    }
}
