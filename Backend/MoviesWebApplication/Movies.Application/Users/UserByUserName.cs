using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Movies.Domain.DTOs;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;

namespace Movies.Application.Users
{
    public class UserByUserName
    {
        public class Query : IRequest<UserProfileDto>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserProfileDto>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<UserProfileDto> Handle(Query request, CancellationToken cancellationToken)
            {

                var user = await _context.Users
                    .Include(u => u.Reviews)
                    .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                if (user == null)
                {
                    throw new NotFoundException($"Użytkownik o nazwie '{request.UserName}' nie zostal odnaleziony.");
                }

                //Pobierz token JWT z nagłówka
                var userClaims = _httpContextAccessor.HttpContext.User;
                var tokenUserId = userClaims?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                bool isOwner = false;
                if (tokenUserId != null && user.Id.ToString() == tokenUserId)
                {
                    isOwner = true;
                }

                string relationType = "None"; //Domyślnie brak relacji
                Guid? relationId = null;

                //Sprawdzenie relacji
                if (!isOwner && tokenUserId != null)
                {
                    var relation = await _context.UserRelations
                        .FirstOrDefaultAsync(ur =>
                            (ur.FirstUserId == tokenUserId && ur.SecondUserId == user.Id) ||
                            (ur.SecondUserId == tokenUserId && ur.FirstUserId == user.Id),
                            cancellationToken
                        );

                    if (relation != null)
                    {
                        if (relation.Type == UserRelation.RelationType.Friend)
                            relationType = "Friend";
                        else if (relation.Type == UserRelation.RelationType.Blocked)
                            relationType = "Blocked";
                            relationId = relation.UserRelationId;
                    }
                }

                return new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    UserRole = user.UserRole,
                    ReviewsCount = user.Reviews?.Count ?? 0,
                    IsOwner = isOwner,
                    IsGoogleUser = user.IsGoogleUser,
                    RelationType = relationType,
                    RelationId = relationId,
                };
            }
        }
    }
}
