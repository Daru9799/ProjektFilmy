using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Movies.Application.MovieRecommend;
using Movies.Application.MovieRecommendation;
using Movies.Application.Replies;
using Movies.Domain;
using Movies.Domain.DTOs;
using Movies.Infrastructure;

namespace MoviesWebApplication.Controllers
{
    public class RecommendationsController : BaseApiController
    {
        // DataContext wymagana dla transakcji
        private readonly DataContext _context;
        // Wstrzyknij DataContext przez konstruktor
        public RecommendationsController(DataContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet("by-movieId/{movieId}")]
        public async Task<ActionResult<PagedResponse<MovieRecommendDto>>> GetRecommendsByMovieId(Guid movieId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        {
            var command = new GetRecommendsByMovieId.GetRecommendsByMovieIdCommand
            {
                MovieId = movieId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            try
            {
                var result = await Mediator.Send(command);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }

        }

        [Authorize]
        [HttpPost("{movieId}/add-recommend-with-like/{recommendMoviedId}")]
        public async Task<IActionResult> CreateNewRecommendation(Guid movieId, Guid recommendMoviedId)
        {
            var createCommand = new CreateNewMovieRecommend.CreateNewMovieRecommendCommend
            {
                MovieId = movieId,
                RecommendedMovieId = recommendMoviedId
            };
            // polecenie które inicjalizuje transakcję bazodanową, która zapewnia atomiczność (niepodzielność) operacji na bazie danych
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Tworzenie nowej rekomendacji
                var recommendation = await Mediator.Send(createCommand);

                // 2. Dodajemy like
                var likeCommand = new CreateUserLikeRecommend.CreateUserLikeRecommendCommand
                {
                    RecommendationId = recommendation.RecommendationId
                };
                await Mediator.Send(likeCommand);

                await transaction.CommitAsync();

                return Ok("Pomyślnie dodano rekomendację i polubienie.");
            }
            catch (ValidationException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                await transaction.RollbackAsync();
                return Conflict(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpPost("like-recommend/{recommendId}")]
        public async Task<IActionResult> LikeRecommendation(Guid recommendId)
        {

            var command = new CreateUserLikeRecommend.CreateUserLikeRecommendCommand
            {
                RecommendationId = recommendId
            };
            try
            {
                await Mediator.Send(command);
                return Ok("Pomyślnie polubiono rekomendacje.");
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpDelete("delete-like-recommend/{recommendId}")]
        public async Task<IActionResult> DeleteLikeRecommendation(Guid recommendId)
        {
            var command = new DeleteUserLikeRecommend.DeleteUserLikeRecommendCommand
            {
                RecommendationId = recommendId
            };
            try
            {
                await Mediator.Send(command);
                return Ok("Pomyślnie usunięto polubienie rekomendacji.");
            }
            catch (ValidationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { Error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}
