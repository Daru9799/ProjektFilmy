using MediatR;
using Microsoft.AspNetCore.Mvc;
using Movies.Application._Common.Exceptions;
using MoviesWebApplication.Common.Responses;

namespace MoviesWebApplication.Common
{
    public static class MediatorExtensions
    {
        public static async Task<IActionResult> SendWithExceptionHandling<TResult>(
            this IMediator mediator,
            IRequest<TResult> command)
        {
            try
            {
                var result = await mediator.Send(command);
                return new OkObjectResult(result);
            }
            catch (UnauthorizedException ex)
            {
                return new UnauthorizedObjectResult(ApiResponse.Unauthorized(ex.Message));
            }
            catch (NotFoundException ex)
            {
                return new NotFoundObjectResult(ApiResponse.NotFound(ex.Message));
            }
            catch (BadRequestException ex)
            {
                return new BadRequestObjectResult(ApiResponse.BadRequest(ex.Message));
            }
            catch (ForbidenException ex)
            {
                return new ObjectResult(ApiResponse.Forbidden(ex.Message))
                {
                    StatusCode = 403
                };
            }
            catch (ConflictException ex)
            {
                return new ConflictObjectResult(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return new ObjectResult(ApiResponse.InternalServerError($"Wystąpił nieoczekiwany błąd: {ex.Message}"))
                {
                    StatusCode = 500
                };
            }
        }
        public static async Task<IActionResult> SendWithExceptionHandling<TResult>(
            this IMediator mediator,
            IRequest<TResult> command,
            string message)
        {
            try
            {
                var result = await mediator.Send(command);
                return new OkObjectResult(message);
            }
            catch (UnauthorizedException ex)
            {
                return new UnauthorizedObjectResult(ApiResponse.Unauthorized(ex.Message));
            }
            catch (NotFoundException ex)
            {
                return new NotFoundObjectResult(ApiResponse.NotFound(ex.Message));
            }
            catch (BadRequestException ex)
            {
                return new BadRequestObjectResult(ApiResponse.BadRequest(ex.Message));
            }
            catch (ForbidenException ex)
            {
                return new ObjectResult(ApiResponse.Forbidden(ex.Message))
                {
                    StatusCode = 403
                };
            }
            catch (ConflictException ex)
            {
                return new ConflictObjectResult(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return new ObjectResult(ApiResponse.InternalServerError($"Wystąpił nieoczekiwany błąd: {ex.Message}"))
                {
                    StatusCode = 500
                };
            }
        }
        public static async Task<ActionResult<TResult>> SendWithTypedExceptionHandling<TResult>(
        this IMediator mediator,
        IRequest<TResult> command)
        {
            try
            {
                var result = await mediator.Send(command);
                return result;
            }
            catch (UnauthorizedException ex)
            {
                return new UnauthorizedObjectResult(ApiResponse.Unauthorized(ex.Message));
            }
            catch (NotFoundException ex)
            {
                return new NotFoundObjectResult(ApiResponse.NotFound(ex.Message));
            }
            catch (BadRequestException ex)
            {
                return new BadRequestObjectResult(ApiResponse.BadRequest(ex.Message));
            }
            catch (ForbidenException ex)
            {
                return new ObjectResult(ApiResponse.Forbidden(ex.Message))
                {
                    StatusCode = 403
                };
            }
            catch (ConflictException ex)
            {
                return new ConflictObjectResult(ApiResponse.Conflict(ex.Message));
            }
            catch (Exception ex)
            {
                return new ObjectResult(ApiResponse.InternalServerError($"Wystąpił nieoczekiwany błąd: {ex.Message}"))
                {
                    StatusCode = 500
                };
            }
        }
    }
}