using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.UserRelations
{
    public class UserRelationsByUserName
    {
        public class Query : IRequest<List<UserRelationDto>>
        {
            public string UserName { get; set; }
            public string Type { get; set; } //"Friend", "Blocked" itd.
        }

        public class Handler : IRequestHandler<Query, List<UserRelationDto>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<List<UserRelationDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                //Sprawdzenie czy user jest zalogowany
                var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                if (user == null)
                    throw new ValidationException($"Nie znaleziono użytkownika o nazwie '{request.UserName}'.");

                var userId = user.Id;

                if (string.IsNullOrEmpty(currentUserId) || userId != currentUserId)
                {
                    throw new UnauthorizedAccessException("Nie masz uprawnień do przeglądania listy tego użytkownika.");
                }

                //Szukanie relacji (z obu stron A - B i B - A)
                var query = _context.UserRelations
                    .Include(r => r.FirstUser)
                    .Include(r => r.SecondUser)
                    .Where(r => r.FirstUserId == userId || r.SecondUserId == userId)
                    .AsQueryable();

                //Zwracanie po podanym typie (lub jesli brak bez filtrowania)
                if (!string.IsNullOrEmpty(request.Type) && Enum.TryParse<UserRelation.RelationType>(request.Type, true, out var relationType))
                {
                    if (relationType == UserRelation.RelationType.Blocked)
                    {
                        //Relacja jednostronna (Blocked)
                        query = _context.UserRelations
                            .Include(r => r.FirstUser)
                            .Include(r => r.SecondUser)
                            .Where(r => r.FirstUserId == userId && r.Type == relationType);
                    }
                    else
                    {
                        //Dwustronne relacje (Friend)
                        query = _context.UserRelations
                            .Include(r => r.FirstUser)
                            .Include(r => r.SecondUser)
                            .Where(r =>
                                (r.FirstUserId == userId || r.SecondUserId == userId) &&
                                r.Type == relationType);
                    }
                }
                else
                {
                    //Gdy nie ma podanego typu
                    query = _context.UserRelations
                        .Include(r => r.FirstUser)
                        .Include(r => r.SecondUser)
                        .Where(r => r.FirstUserId == userId || r.SecondUserId == userId);
                }

                var relations = await query.ToListAsync(cancellationToken);

                var relationDtos = relations.Select(r =>
                {
                    //Wyznaczenie drugiego usera 
                    User otherUser;
                    if (r.FirstUserId == userId)
                    {
                        otherUser = r.SecondUser;
                    }
                    else
                    {
                        otherUser = r.FirstUser;
                    }

                    return new UserRelationDto
                    {
                        RelationId = r.UserRelationId,
                        RelatedUserId = otherUser.Id,
                        RelatedUserName = otherUser.UserName,
                        Type = r.Type.ToString()
                    };
                }).ToList();

                return relationDtos;
            }
        }
    }
}
