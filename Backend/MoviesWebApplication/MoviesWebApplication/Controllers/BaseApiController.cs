﻿using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace MoviesWebApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //endpoint
    public class BaseApiController : ControllerBase 
    {
        private IMediator? _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
    }
}
