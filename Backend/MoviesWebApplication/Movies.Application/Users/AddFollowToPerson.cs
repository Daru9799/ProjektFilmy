using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.Users
{
    public class AddFollowToPerson
    {
        public class AddFollowToPersonCommand : IRequest<Person>
        {
            public Guid PersonId { get; set; }

        }

        public class Handler : IRequestHandler<AddFollowToPersonCommand, Person>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Person> Handle(AddFollowToPersonCommand request, CancellationToken cancellationToken)
            {
                
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                var person = await _context.People
                    .Include(p => p.Followers)
                    .FirstOrDefaultAsync(p => p.PersonId == request.PersonId, cancellationToken);

                if(person == null)
                {
                    throw new NotFoundException("Nie znaleziono osoby.");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null) 
                { 
                    throw new NotFoundException("Nie znaleziono użytkownika."); 
                }

                if(person.Followers.Any(u => u.Id == user.Id))
                {
                    throw new ConflictException("Użytkownik już obserwuje tą osobę");
                }

                person.Followers.Add(user);

                await _context.SaveChangesAsync(cancellationToken);

                return person;
            }

        }

    }
    
}
