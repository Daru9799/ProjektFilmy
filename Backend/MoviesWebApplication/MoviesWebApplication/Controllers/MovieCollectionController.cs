using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Movies.Application.MovieCollections;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using MoviesWebApplication.Responses;

namespace MoviesWebApplication.Controllers
{
    public class MovieCollectionController:BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("by-user-id/{userId}")]
        public async Task<ActionResult<List<MovieCollectionDto>>> GetMovieCollectionsByUserId(
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

            var reviews = await Mediator.Send(query);

            if (reviews.Data == null || !reviews.Data.Any())
            {
                return NotFound(ApiResponse.NotFound($"Nie znaleziono listy filmów dla użytkownika o ID '{userId}'."));
            }

            return Ok(reviews);
        }


        [AllowAnonymous] // do testow
        [HttpGet("all")]
        public async Task<ActionResult<PagedResponse<MovieCollectionDto>>> GetMoiveCollection([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var query = new MovieCollectionList.Query
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest(ApiResponse.BadRequest("Nieprawidłowe parametry paginacji. PageNumber i PageSize muszą być większe od 0, a PageSize nie może przekraczać 100."));
            }

            var pagedReviews = await Mediator.Send(query);

            return Ok(pagedReviews);

        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieCollectionDto>> GetMovieCollection(
            Guid id,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var movie = await Mediator.Send(new CollectionById.Query
            {
                Id = id,
                PageNumber = pageNumber,
                PageSize = pageSize
            });

            if (movie == null)
            {
                return NotFound(ApiResponse.NotFound($"Nie odnaleziono listy filmów z id {id}."));
            }

            return Ok(movie);
        }

        [Authorize]
        [HttpPost("add-collection")]
        public async Task<IActionResult> CreateMovieCollection([FromBody] CreateMovieCollection.CreateMovieCollectionCommand command)
        {
            try
            {
                var movieCollection = await Mediator.Send(command);
                return Ok(new
                {
                    message = "Pomyślnie utworzono kolekcję.",
                    collectionId = movieCollection.MovieCollectionId
                });
            }
            catch (ValidationException ex)
            {
                return BadRequest(ApiResponse.BadRequest("Nieprawidłowe wprowadzone dane."));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (Exception ex) 
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się stworzyć kolekcji filmów. \n{ex.Message}"));
            }
        }



        [Authorize]
        [HttpDelete("delete-collection/{id}")]
        public async Task<IActionResult> DeleteMovieCollection(Guid id)
        {
            try
            {
                var result = await Mediator.Send(new DeleteMovieCollection(id));

                if (result == null)
                {
                    return NotFound(ApiResponse.NotFound($"Nie znaleziono listy filmów z ID: {id}"));
                }

                return Ok("Pomyślnie usunięto kolekcje.");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Wystąpił nieoczekiwany błąd przy usuwaniu kolekcji filmów. \n{ex.Message}"));
            }
        }



        [Authorize]
        [HttpPatch("edit-collection/{id}")]
        public async Task<IActionResult> EditMovieCollection(Guid id, [FromBody] EditMovieCollection.EditMovieCollectionCommand command)
        {
            try
            {
                command.MovieCollectionId = id;

                var movieCollection = await Mediator.Send(command);

                return Ok("Pomyślnie zmieniono kolekcje.");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch(UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Wystąpił nieoczekiwany błąd przy edycji kolekcji filmów. \n{ex.Message}"));
            }
        }
    }
}
