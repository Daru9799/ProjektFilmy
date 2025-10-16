using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Movies.Application.Reviews.EditReview;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Replies
{
    public class EditReply
    {
        public class EditReplyCommand : IRequest<Reply>
        {
            public Guid ReplyId { get; set; }
            public string Comment { get; set; }
        }

        public class Handler : IRequestHandler<EditReplyCommand, Reply>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Reply> Handle(EditReplyCommand request, CancellationToken cancellationToken)
            {

                // Pobranie ID aktualnie zalogowanego użytkownika
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                var currentUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                //Pobranie recenzji z bazy
                var reply = await _context.Replies
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.ReplyId == request.ReplyId, cancellationToken);

                if (reply == null)
                {
                    throw new NotFoundException($"Nie znaleziono odpowiedzi o podanym ID");
                }

                //Sprawdzenie czy user jest właścicielem bądź moderatorem
                bool isOwner = reply.User != null && reply.User.Id == currentUserId;
                bool isMod = currentUser.UserRole == User.Role.Mod;

                if (!isOwner && !isMod)
                {
                    throw new ForbidenException("Nie masz uprawnień do edycji tego komentarza.");
                }

                //if (reply.User == null || reply.User.Id != currentUserId)
                //{
                //    throw new UnauthorizedAccessException("Nie masz uprawnień do modyfikacji tej odpowiedzi. Nie jesteś właścicielem tego komentarza.");
                //}

                if (!string.IsNullOrEmpty(request.Comment))
                {
                    reply.Comment = request.Comment;
                    reply.Date = DateTime.Now;
                }

                //Zapis zmian w bazie danych
                await _context.SaveChangesAsync(cancellationToken);

                return reply;
            }
        }
    }
}
