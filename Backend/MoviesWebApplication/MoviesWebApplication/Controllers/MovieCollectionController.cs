using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollections;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Common;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionController:BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<PagedResponse<MovieCollectionDto>>> GetMovieCollectionsByUserId(
            Guid userId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 2,
            [FromQuery] string orderBy = "likes",
            [FromQuery] string sortDirection = "desc",
            [FromQuery] List<MovieCollection.VisibilityMode> visibilityMode = null,
            [FromQuery] List<MovieCollection.CollectionType> collectionType = null)
        {
            var query = new CollectionsByUserId.Query
            {
                UserId = userId,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SortDirection = sortDirection,
                OrderBy = orderBy,
                visibilityMode = visibilityMode,
                collectionType = collectionType
            };

            return await Mediator.SendWithTypedExceptionHandling(query);
        }


        /*[AllowAnonymous] // do testow
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<MovieCollectionDto>>> GetMoiveCollection([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new MovieCollectionList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            return await Mediator.SendWithTypedExceptionHandling(query);

        }*/


        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieCollectionDto>> GetMovieCollection(
            Guid id,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {

            return await Mediator.SendWithTypedExceptionHandling(new CollectionById.Query
            {
                Id = id,
                PageNumber = pageNumber,
                PageSize = pageSize
            });

        }

        [Authorize]
        [HttpPost("add-collection")]
        public async Task<IActionResult> CreateMovieCollection([FromBody] CreateMovieCollection.CreateMovieCollectionCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie utworzono kolekcję.");
        }



        [Authorize]
        [HttpDelete("delete-collection/{id}")]
        public async Task<IActionResult> DeleteMovieCollection(Guid id)
        {
            return await Mediator.SendWithExceptionHandling(new DeleteMovieCollection(id), "Pomyślnie usunięto kolekcje.");
        }



        [Authorize]
        [HttpPatch("edit-collection/{id}")]
        public async Task<IActionResult> EditMovieCollection(Guid id, [FromBody] EditMovieCollection.EditMovieCollectionCommand command)
        {
            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie zmieniono kolekcje.");
        }
    }
}
