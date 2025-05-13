using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain.Entities;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;

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

        public DeleteUserRelationHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<UserRelation> Handle(DeleteUserRelation request, CancellationToken cancellationToken)
        {
            var relation = await _context.UserRelations
                .FirstOrDefaultAsync(r => r.UserRelationId == request.RelationId, cancellationToken);

            if (relation == null)
            {
                return null;
            }

            _context.UserRelations.Remove(relation);
            await _context.SaveChangesAsync(cancellationToken);

            return relation;
        }
    }
}
