using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Movies.Application.Users
{
    public class GetFollowByPersonId
    {
        public class Query : IRequest<bool>
        {
            public Guid PersonId { get; set; }

        }
        public class Handler : IRequestHandler<Query, bool>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                }

                var person = await _context.People
                    .Include(p => p.Followers)
                    .FirstOrDefaultAsync(p => p.PersonId == request.PersonId, cancellationToken);

                if (person == null)
                {
                    throw new ValidationException($"Osoba o ID {request.PersonId} nie została znaleziona");
                }
                // Sprawdź czy wśród obserwujących jest użytkownik o currentUserId
                return person.Followers.Any(f => f.Id == currentUserId);

            }
        }
    }
}
