using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Movies.Application.Reviews.CreateReview;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Movies.Application.Replies
{
    public class CreateReply
    {
        public class CreateReplyCommand : IRequest<Reply>
        {
            public string Comment { get; set; }
            public Guid ReviewId { get; set; }
        }
        public class Handler : IRequestHandler<CreateReplyCommand, Reply>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Reply> Handle(CreateReplyCommand request, CancellationToken cancellationToken)
            {

                // Pobranie ID aktualnie zalogowanego użytkownika
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(currentUserId))
                {
                    throw new UnauthorizedAccessException("Użytkownik nie jest zalogowany");
                }

                //Sprawdzanie istnienia recenzja
                var review = await _context.Reviews
                    .FirstOrDefaultAsync(rev => rev.ReviewId == request.ReviewId, cancellationToken);

                if (review == null)
                {
                    throw new ValidationException($"Nie znaleziono recenzji o ID: {request.ReviewId}");
                }

                //Sprawdzanie istnienia użytkownika
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);

                if (user == null)
                {
                    throw new ValidationException($"Nie znaleziono użytkownika o podanym ID");
                }

                //Tworzenie nowej recenzji
                var reply = new Reply
                {
                    ReplyId = Guid.NewGuid(),
                    Comment = request.Comment,
                    Date = DateTime.Now,
                    User = user,
                    Review = review
                };

                //Dodanie recenzji do bazy danych
                _context.Replies.Add(reply);
                await _context.SaveChangesAsync(cancellationToken);

                return reply;
            }
        }
    }
}
