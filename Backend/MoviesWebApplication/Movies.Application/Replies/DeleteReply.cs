using MediatR;
using Movies.Application.Reviews;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Application._Common.Exceptions;

namespace Movies.Application.Replies
{
    public class DeleteReply
    {
        public class DeleteReplyCommand : IRequest<Reply>
        {
            public Guid ReplyId { get; set; }
        }
        public class DeleteReplyCommandHandler : IRequestHandler<DeleteReplyCommand, Reply>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public DeleteReplyCommandHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Reply> Handle(DeleteReplyCommand request, CancellationToken cancellationToken)
            {
                // Pobranie ID aktualnie zalogowanego użytkownika
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedException("Użytkownik nie jest zalogowany");
                }

                var currentUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                // Pobranie odpowiedzi z bazy wraz z użytkownikiem
                var reply = await _context.Replies
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.ReplyId == request.ReplyId, cancellationToken);

                if (reply == null)
                {
                    throw new NotFoundException("Nie znaleziono odpowiedzi o podanym ID");
                }

                //Sprawdzenie czy user jest właścicielem bądź moderatorem
                bool isOwner = reply.User != null && reply.User.Id == currentUserId;
                bool isMod = currentUser.UserRole == User.Role.Mod;

                if (!isOwner && !isMod)
                {
                    throw new ForbidenException("Nie masz uprawnień do usunięcia tego komentarza.");
                }

                // Sprawdzenie czy użytkownik jest autorem odpowiedzi
                //if (reply.User == null || reply.User.Id != currentUserId)
                //{
                //    throw new UnauthorizedAccessException("Nie masz uprawnień do usunięcia tej odpowiedzi. Nie jesteś właścicielem tego komentarza.");
                //}

                _context.Replies.Remove(reply);
                await _context.SaveChangesAsync(cancellationToken);

                return reply;
            }
        }
    }

}
