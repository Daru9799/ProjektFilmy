using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Movies.Application._Common.Exceptions;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Movies.Application.UserRelations
{
    public class DeleteUserRelation : IRequest<UserRelation>
    {
        public Guid RelationId { get; set; }

        public DeleteUserRelation(Guid relationId)
        {
            RelationId = relationId;
        }
    }
    public class DeleteUserRelationHandler : IRequestHandler<DeleteUserRelation, UserRelation>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteUserRelationHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<UserRelation> Handle(DeleteUserRelation request, CancellationToken cancellationToken)
        {
            var currentUserId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(currentUserId))
            {
                throw new UnauthorizedException("Użytkownik nie jest zalogowany");
            }

            var relation = await _context.UserRelations
                .FirstOrDefaultAsync(r => r.UserRelationId == request.RelationId, cancellationToken);

            if (relation == null)
            {
                throw new NotFoundException($"Nie znaleziono relacji o ID: {request.RelationId}");
            }

            if (string.IsNullOrEmpty(currentUserId) || (relation.FirstUserId != currentUserId && relation.SecondUserId != currentUserId))
            {
                throw new ForbidenException("Nie masz uprawnień do usuwania tej relacji.");
            }

            _context.UserRelations.Remove(relation);
            await _context.SaveChangesAsync(cancellationToken);

            return relation;
        }
    }
}
