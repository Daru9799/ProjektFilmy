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
using Movies.Application.Interfaces;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Notifications
{
    public class CreateNotification
    {
        public class CreateNotificationCommand : IRequest<Notification>
        {
            public string Title { get; set; }
            public string Description { get; set; }
            public string Type { get; set; }
            public DateTime Date { get; set; }
            public bool IsRead { get; set; }
            public string Resource { get; set; }
            public string SourceUserId { get; set; }
            public string TargetUserId { get; set; }

            public class Handler : IRequestHandler<CreateNotificationCommand, Notification>
            {
                private readonly DataContext _context;
                private readonly INotificationSender _notificationSender;

                public Handler(DataContext context, INotificationSender notificationSender)
                {
                    _context = context;
                    _notificationSender = notificationSender;
                }

                public async Task<Notification> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
                {
                    //Sprawdzenie czy istnieje użytkownik do którego chcemy wysłac powiadomienie
                    var targetUser = await _context.Users
                        .FirstOrDefaultAsync(u => u.Id == request.TargetUserId, cancellationToken);

                    if (targetUser == null)
                    {
                        throw new NotFoundException($"Nie znaleziono użytkownika docelowego o ID: {request.TargetUserId}");
                    }

                    if (!Enum.TryParse<Notification.NotificationType>(request.Type, true, out var parsedType))
                    {
                        throw new BadRequestException($"Niepoprawny typ powiadomienia: {request.Type}");
                    }

                    //Jeśli SourceUserId b\edzie wynosić 0 to jest to powiadomienie systemowe
                    User sourceUser = null;
                    if (request.SourceUserId != "0")
                    {
                        sourceUser = await _context.Users
                            .FirstOrDefaultAsync(u => u.Id == request.SourceUserId, cancellationToken);

                        if (sourceUser == null)
                        {
                            throw new NotFoundException($"Nie znaleziono nadawcy powiadomienia o ID: {request.SourceUserId}");
                        }
                    }

                    var existingRelation = await _context.UserRelations
                        .FirstOrDefaultAsync(r =>
                            (r.FirstUserId == request.SourceUserId && r.SecondUserId == request.TargetUserId ||
                                r.FirstUserId == request.TargetUserId && r.SecondUserId == request.SourceUserId) &&
                            r.Type == UserRelation.RelationType.Friend, cancellationToken);

                    if ((existingRelation != null) && request.Type == Notification.NotificationType.Invitation.ToString())
                    {
                        throw new ConflictException("Użytkownik jest już Twoim znajomym!");
                    }

                    var reverseInvitation = await _context.Notifications
                        .FirstOrDefaultAsync(n =>
                            n.Type == Notification.NotificationType.Invitation &&
                            n.SourceUserId == request.TargetUserId &&
                            n.TargetUserId == request.SourceUserId, cancellationToken);

                    if (reverseInvitation != null)
                    {
                        _context.Notifications.Remove(reverseInvitation);

                        var relation = new UserRelation
                        {
                            UserRelationId = Guid.NewGuid(),
                            FirstUserId = request.SourceUserId,
                            SecondUserId = request.TargetUserId,
                            Type = UserRelation.RelationType.Friend,
                            FirstUser = sourceUser,
                            SecondUser = targetUser
                        };

                        _context.UserRelations.Add(relation);
                        await _context.SaveChangesAsync(cancellationToken);

                        return null;
                    }

                    var notification = new Notification
                    {
                        NotificationId = Guid.NewGuid(),
                        Title = request.Title,
                        Description = request.Description,
                        Type = parsedType,
                        Date = request.Date,
                        IsRead = request.IsRead,
                        Resource = request.Resource,
                        SourceUserId = request.SourceUserId == "0" ? null : request.SourceUserId,
                        TargetUserId = request.TargetUserId,
                        SourceUser = sourceUser,
                        TargetUser = targetUser
                    };

                    _context.Notifications.Add(notification);
                    await _context.SaveChangesAsync(cancellationToken);

                    //Wysłanie powiadomienia przez SignalR
                    await _notificationSender.SendAsync(notification);

                    return notification;
                }
            }
        }
    }
}
