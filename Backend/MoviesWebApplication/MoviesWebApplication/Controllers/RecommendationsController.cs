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
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Controllers
{
    public class RecommendationsController : BaseApiController
    {
        private readonly DataContext _context;
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
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się pobrać rekomendacji dla tego filmu. \n{ex.Message}"));
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
            catch(UnauthorizedAccessException ex)
            {
                await transaction.RollbackAsync();
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (ValidationException ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ApiResponse.BadRequest(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                await transaction.RollbackAsync();
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                await transaction.RollbackAsync();
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się dodać nowej rekomendacji. \n{ex.Message}"));
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
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się polubić rekomendacji. \n{ex.Message}"));
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
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ApiResponse.Unauthorized(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse.NotFound(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.InternalServerError($"Nie udało się usunąć polubienia rekomendacji. \n{ex.Message}"));
            }

        }

    }
}
