using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.UserRelations
{
    public class CreateUserRelation
    {
        public class CreateUserRelationCommand : IRequest<UserRelation>
        {
            public string FirstUserId { get; set; }
            public string SecondUserId { get; set; }
            public UserRelation.RelationType Type { get; set; }

            public class Handler : IRequestHandler<CreateUserRelationCommand, UserRelation>
            {
                private readonly DataContext _context;

                public Handler(DataContext context)
                {
                    _context = context;
                }

                public async Task<UserRelation> Handle(CreateUserRelationCommand request, CancellationToken cancellationToken)
                {
                    //Sprawdzenie czy obaj uzytkownicy istnieją w bazie
                    var firstUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == request.FirstUserId, cancellationToken);

                    if (firstUser == null)
                    {
                        throw new NotFoundException($"Nie znaleziono użytkownika o ID: {request.FirstUserId}");
                    }

                    var secondUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == request.SecondUserId, cancellationToken);

                    if (secondUser == null)
                    {
                        throw new NotFoundException($"Nie znaleziono użytkownika o ID: {request.SecondUserId}");
                    }

                    //Sprawdzenie czy nie ma juz relacji tego typu
                    var existingRelation = await _context.UserRelations
                        .FirstOrDefaultAsync(r =>
                            (r.FirstUserId == request.FirstUserId && r.SecondUserId == request.SecondUserId) ||
                            (r.FirstUserId == request.SecondUserId && r.SecondUserId == request.FirstUserId), cancellationToken);

                    if (existingRelation != null)
                    {
                        throw new ConflictException("Taka relacja już istnieje!");
                    }

                    //Tworzenie nowej relacji
                    var relation = new UserRelation
                    {
                        UserRelationId = Guid.NewGuid(),
                        FirstUserId = request.FirstUserId,
                        SecondUserId = request.SecondUserId,
                        Type = request.Type,
                        FirstUser = firstUser,
                        SecondUser = secondUser
                    };

                    _context.UserRelations.Add(relation);

                    //Jeśli to relacja "Friend" usuwa zaproszenia pomiędzy tymi użytkownikami
                    if (request.Type == UserRelation.RelationType.Friend)
                    {
                        var invitations = await _context.Notifications
                            .Where(n =>
                                n.Type == Notification.NotificationType.Invitation &&
                                ((n.SourceUserId == request.FirstUserId && n.TargetUserId == request.SecondUserId) ||
                                 (n.SourceUserId == request.SecondUserId && n.TargetUserId == request.FirstUserId)))
                            .ToListAsync(cancellationToken);

                        if (invitations.Any())
                        {
                            _context.Notifications.RemoveRange(invitations);
                        }
                    }

                    await _context.SaveChangesAsync(cancellationToken);

                    return relation;
                }
            }
        }
    }
}
