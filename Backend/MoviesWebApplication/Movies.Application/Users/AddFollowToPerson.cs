﻿using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.Users
{
    public class AddFollowToPerson
    {
        public class AddFollowToPersonCommand : IRequest<Person>
        {
            public Guid PersonId { get; set; }
            public string UserId { get; set; }

        }

        public class Handler : IRequestHandler<AddFollowToPersonCommand, Person>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Person> Handle(AddFollowToPersonCommand request, CancellationToken cancellationToken)
            {

                var person = await _context.People
                    .Include(p => p.Followers)
                    .FirstOrDefaultAsync(p => p.PersonId == request.PersonId, cancellationToken);
                if(person == null)
                    throw new Exception("Nie znaleziono osoby.");

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

                if (user == null) throw new Exception("Nie znaleziono użytkownika.");

                if(person.Followers.Any(u => u.Id == user.Id ))
                    throw new InvalidOperationException("Użytkownik już obserwuje tą osobę");

                person.Followers.Add(user);

                await _context.SaveChangesAsync(cancellationToken);

                return person;
            }

        }

    }
    
}
