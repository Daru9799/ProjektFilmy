using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

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

            public Handler(DataContext context)
            {
                _context = context;
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

                return new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    UserRole = user.UserRole,
                    ReviewsCount = user.Reviews?.Count ?? 0
                };
            }
        }
    }
}
