using System.Net;
using FluentAssertions;


namespace Movies.Tests;

public class Test : IClassFixture<CustomWebAppFactory>
{

    private readonly HttpClient _client;

    public Test(CustomWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAllMovies_ShouldReturnOK()
    {
        var response = await _client.GetAsync("/api/Movies/all");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

}