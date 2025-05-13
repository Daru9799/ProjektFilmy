using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.DTOs;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

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

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<UserRelationDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);

                if (user == null)
                    throw new ValidationException($"Nie znaleziono użytkownika o nazwie '{request.UserName}'.");

                var userId = user.Id;

                //Szukanie relacji (z obu stron A - B i B - A)
                var query = _context.UserRelations
                    .Include(r => r.FirstUser)
                    .Include(r => r.SecondUser)
                    .Where(r => r.FirstUserId == userId || r.SecondUserId == userId)
                    .AsQueryable();

                //Zwracanie po podanym typie (lub jesli brak bez filtrowania)
                if (!string.IsNullOrEmpty(request.Type) && Enum.TryParse<UserRelation.RelationType>(request.Type, true, out var relationType))
                {
                    query = query.Where(r => r.Type == relationType);
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
