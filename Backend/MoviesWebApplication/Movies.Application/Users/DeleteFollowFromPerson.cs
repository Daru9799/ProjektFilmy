using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Movies.Application._Common.Exceptions;
using System.Security.Claims;

namespace Movies.Application.Users
{
    public class DeleteFollowFromPerson
    {
        public class DeleteFollowFromPersonCommand : IRequest<Person>
        {
            public Guid PersonId { get; set; }
        }

        public class Handler : IRequestHandler<DeleteFollowFromPersonCommand, Person>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Person> Handle(DeleteFollowFromPersonCommand request, CancellationToken cancellationToken)
            {
                //Sprawdzenie czy user jest zalogowany
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                var person = await _context.People
                    .Include(p => p.Followers)
                    .FirstOrDefaultAsync(p => p.PersonId == request.PersonId, cancellationToken);
                if (person == null)
                {
                    throw new NotFoundException("Nie znaleziono osoby.");
                }   

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException("Nie znaleziono użytkownika.");
                }

                // Sprawdzenie czy użytkownik faktycznie obserwuje tę osobę
                if (person.Followers.FirstOrDefault(f => f.Id == user.Id) == null)
                {
                    throw new NotFoundException("Użytkownik nie obserwuje tej osoby.");
                }    

                person.Followers.Remove(user);

                await _context.SaveChangesAsync(cancellationToken);

                return person;
            }

        }
    }
}
