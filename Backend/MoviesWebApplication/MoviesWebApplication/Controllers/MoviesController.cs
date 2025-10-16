using Microsoft.AspNetCore.Mvc;
using Movies.Application.Movies;
using Movies.Domain;
using Microsoft.AspNetCore.Authorization;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using static Movies.Application.Movies.AddMovieToPlanned;
using static Movies.Application.Movies.AddMovieToWatched;
using Movies.Application.People;
using MoviesWebApplication.Common.Responses;
using MoviesWebApplication.Common;

namespace MoviesWebApplication.Controllers
{
    [AllowAnonymous]
    public class MoviesController : BaseApiController
    {
        //Zwracanie wszystkich filmów
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<MovieDto>>> GetMovies([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "title", [FromQuery] string sortDirection = "asc")
        {
            return await Mediator.SendWithTypedExceptionHandling(new MoviesList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                OrderBy = orderBy,
                SortDirection = sortDirection
            });
        }

        //Zwracanie filmu o konkretnym id
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDto>> GetMovie(Guid id)
        {
            return await Mediator.SendWithTypedExceptionHandling(new MovieById.Query { Id = id });
        }

        //Zwraca liste filmów, poprzez listę movieId tych filmów.
        [HttpGet("get-list-by-id")]
        public async Task<ActionResult<List<MovieDto>>> GetMovieListById(
            [FromQuery] List<Guid> movieIdList = null) 
        {
            return await Mediator.SendWithTypedExceptionHandling(new MoviesListByIds.Query { moviesIds = movieIdList });
        }

        //Zwracanie filmów dla podanego id reżysera
        [HttpGet("by-personId/{personId}")]
        public async Task<ActionResult<List<MovieDto>>> GetMoviesByDirectorId(Guid personId)
        {
            return await Mediator.SendWithTypedExceptionHandling(new MoviesByPersonId.Query { PersonId = personId });
            // !!! WAŻNE - teraz przy braku znalezienia filmów wywala EXCEPTION, a nie jak wcześniej zwraca Pustą liste
        }

        //Zwracanie filmów na podstawie filtrów
        [HttpGet("by-filters")]
        public async Task<ActionResult<PagedResponse<MovieDto>>> GetMoviesByCountry([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2, [FromQuery] string orderBy = "title", [FromQuery] string sortDirection = "asc", [FromQuery] string titleSearch = "", [FromQuery] List<string> countryNames = null, [FromQuery] List<string> categoryNames = null, [FromQuery] List<string> actorsList = null, [FromQuery] List<string> directorsList = null)
        {
            var query = new MoviesByFilters.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                OrderBy = orderBy,
                SortDirection = sortDirection,
                CountryNames = countryNames,
                CategoryNames = categoryNames,
                TitleSearch = titleSearch,
                Actors = actorsList,
                Directors = directorsList
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }

        [HttpGet("by-collectionId/{collectionId}")]
        public async Task<ActionResult<List<MovieDto>>> GetMoviesByCollectionId(
            Guid collectionId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new MovieByCollectionId.Query
            {
                CollectionId = collectionId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
            // !!! WAŻNE - teraz przy braku znalezienia filmów wywala EXCEPTION, a nie jak wcześniej zwraca Pustą liste
        }

        [Authorize]
        [HttpPost("{collectionId}/add-movie/{movieId}")]
        public async Task<IActionResult> AddMovieToCollection(Guid collectionId, Guid movieId)
        {
            var command = new AddMovieToCollection.AddMovieToCollectionCommand
            {
                MovieCollectionId = collectionId,
                MovieId = movieId
            };
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie dodano film do kolekcji.");
        }

        [Authorize]
        [HttpDelete("{collectionId}/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromCollection(Guid collectionId, Guid movieId)
        {

            var command = new DeleteMovieFromCollection.DeleteMovieFromCollectionCommand
            {
                MovieCollectionId = collectionId,
                MovieId = movieId
            };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie usunięto film z kolekcji.");

        }

        //Dodawanie do listy planowanych
        [Authorize]
        [HttpPost("planned/add-movie")]
        public async Task<IActionResult> AddMovieToPlanned([FromBody] AddMovieToPlannedCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie dodano film do planowanych.");
        }

        //Dodawanie do listy obejrzanych
        [Authorize]
        [HttpPost("watched/add-movie")]
        public async Task<IActionResult> AddMovieToWatched([FromBody] AddMovieToWatchedCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie dodano film do obejrzanych.");
        }

        // Usuwanie z listy planowanych
        [Authorize]
        [HttpDelete("planned/delete-from-planned/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromPlanned(Guid movieId)
        {
            var command = new DeleteMovieFromPlanned.DeleteMovieFromPlannedCommand { MovieId = movieId };
            
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie usunięto film z listy planowanych.");
        }

        // Usuwanie z listy obejrzanych
        [Authorize]
        [HttpDelete("watched/delete-from-watched/{movieId}")]
        public async Task<IActionResult> DeleteMovieFromWatched(Guid movieId)
        {
            var command = new DeleteMovieFromWatched.DeleteMovieFromWatchedCommand { MovieId = movieId };
            
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie usunięto film z listy obejrzanych.");
        }

        [Authorize]
        [HttpGet("check-if-in-list/{listType}/{movieId}")]
        public async Task<IActionResult> CheckIfInList(string listType, Guid movieId)
        {
            var query = new CheckIfMovieInList.Query(movieId, listType);

            return await Mediator.SendWithExceptionHandling(query);
            // !!! WAŻNE To może nie działać - do sprawdzenia 
        }

    }
}
