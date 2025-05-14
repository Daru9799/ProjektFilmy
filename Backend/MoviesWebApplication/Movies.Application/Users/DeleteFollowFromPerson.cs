using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.Users
{
    public class DeleteFollowFromPerson
    {
        public class DeleteFollowFromPersonCommand : IRequest<Person>
        {
            public Guid PersonId { get; set; }
            public string UserId { get; set; }
        }

        public class Handler : IRequestHandler<DeleteFollowFromPersonCommand, Person>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Person> Handle(DeleteFollowFromPersonCommand request, CancellationToken cancellationToken)
            {

                var person = await _context.People
                    .Include(p => p.Followers)
                    .FirstOrDefaultAsync(p => p.PersonId == request.PersonId, cancellationToken);
                if (person == null)
                    throw new Exception("Nie znaleziono osoby.");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null) throw new Exception("Nie znaleziono użytkownika.");

                // Sprawdzenie czy użytkownik faktycznie obserwuje tę osobę
                if (person.Followers.FirstOrDefault(f => f.Id == user.Id) == null)
                    throw new InvalidOperationException("Użytkownik nie obserwuje tej osoby.");

                person.Followers.Remove(user);

                await _context.SaveChangesAsync(cancellationToken);

                return person;
            }

        }
    }
}
