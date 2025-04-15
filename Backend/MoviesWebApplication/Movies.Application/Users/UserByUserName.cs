using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Domain.DTOs;

namespace Movies.Application.Users
{
    public class UserByUserName
    {
        public class Query : IRequest<UserProfileDto>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserProfileDto>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<UserProfileDto> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users
                    .Include(u => u.Reviews)
                    .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                if (user == null)
                {
                    return null;
                }

                //Pobierz token JWT z nagłówka
                var userClaims = _httpContextAccessor.HttpContext.User;
                var tokenUserId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                bool isOwner = false;
                if (tokenUserId != null && user.Id.ToString() == tokenUserId)
                {
                    isOwner = true;
                }

                return new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    UserRole = user.UserRole,
                    ReviewsCount = user.Reviews?.Count ?? 0,
                    IsOwner = isOwner
                };
            }
        }
    }
}
