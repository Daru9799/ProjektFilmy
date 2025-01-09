﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Movies.Domain;
using Movies.Infrastructure;
using Microsoft.EntityFrameworkCore;


namespace Movies.Application.Reviews
{
    public class DeleteReviewCommand : IRequest<Review>
    {
        public Guid ReviewId { get; set; }

        public DeleteReviewCommand(Guid reviewId)
        {
            ReviewId = reviewId;
        }
    }

    public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, Review>
    {
        private readonly DataContext _context;

        public DeleteReviewCommandHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Review> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
        {
            // Pobranie recenzji z bazy
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ReviewId == request.ReviewId, cancellationToken);

            if (review == null)
            {
                return null;
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync(cancellationToken); 

            return review;
        }
    }
}
