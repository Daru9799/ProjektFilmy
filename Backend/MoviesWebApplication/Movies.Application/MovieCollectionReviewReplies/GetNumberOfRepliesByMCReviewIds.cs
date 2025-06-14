using MediatR;
using Microsoft.AspNetCore.Http;
using Movies.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Movies.Application.MovieCollectionReviewReplies
{
    public class GetNumberOfRepliesByMCReviewIds
    {
        public class Query : IRequest<List<int>>
        {
            public List<Guid> ReviewIds { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<int>>
        {
            private readonly DataContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IHttpContextAccessor httpContextAccessor)
            {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<List<int>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Utwórz słownik do przechowywania liczby odpowiedzi dla każdego ReviewId
                var replyCounts = await _context.MovieCollectionReviewReplies
                    .Where(r => request.ReviewIds.Contains(r.Review.MovieCollectionReviewId))
                    .GroupBy(r => r.Review.MovieCollectionReviewId)
                    .ToDictionaryAsync(
                        g => g.Key,
                        g => g.Count(),
                        cancellationToken);

                // Zwróć listę liczb odpowiedzi w tej samej kolejności co ReviewIds
                return request.ReviewIds
                    .Select(reviewId => replyCounts.TryGetValue(reviewId, out var count) ? count : 0)
                    .ToList();
            }
        }
    }
}
