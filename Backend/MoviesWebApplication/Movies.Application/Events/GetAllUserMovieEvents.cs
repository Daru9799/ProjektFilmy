using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MediatR;

namespace Movies.Application.Events
{
    public class GetAllUserMovieEvents
    {
        public class Query : IRequest<object>
        {
            public string AccessToken { get; set; }
        }

        public class Handler : IRequestHandler<Query, object>
        {
            public async Task<object> Handle(Query request, CancellationToken cancellationToken)
            {
                var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", request.AccessToken);

                var url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
                          "singleEvents=true&" +
                          "orderBy=startTime&" +
                          "privateExtendedProperty=app=Webfilm"; //filtr po tagu

                var response = await client.GetAsync(url, cancellationToken);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync(cancellationToken);
                var events = JsonSerializer.Deserialize<object>(responseString);

                return events!;
            }
        }
    }
}
