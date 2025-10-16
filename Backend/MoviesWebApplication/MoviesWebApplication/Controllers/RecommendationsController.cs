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
using MoviesWebApplication.Common;
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

            return await Mediator.SendWithTypedExceptionHandling(command);
            // !!! Teraz wyrzuca Exception NotFound zamiast pustej listy
        }

        [Authorize]
        [HttpPost("{movieId}/add-recommend-with-like/{recommendMoviedId}")]
        public async Task<IActionResult> CreateNewRecommendation(Guid movieId, Guid recommendMoviedId)
        {
            var command = new CreateRecommendWithLike.CreateRecommendWithLikeCommand
            {
                MovieId = movieId,
                RecommendedMovieId = recommendMoviedId
            };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie stworzono rekomendacje");

        }
        [Authorize]
        [HttpPost("like-recommend/{recommendId}")]
        public async Task<IActionResult> LikeRecommendation(Guid recommendId)
        {
            var command = new CreateUserLikeRecommend.CreateUserLikeRecommendCommand
            {
                RecommendationId = recommendId
            };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie polubiono rekomendacje");
        }
        [Authorize]
        [HttpDelete("delete-like-recommend/{recommendId}")]
        public async Task<IActionResult> DeleteLikeRecommendation(Guid recommendId)
        {
            var command = new DeleteUserLikeRecommend.DeleteUserLikeRecommendCommand
            {
                RecommendationId = recommendId
            };

            return await Mediator.SendWithExceptionHandling(command, "Pomyślnie zabrano polubienie rekomendacji");
        }

    }
}
