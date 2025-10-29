using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Logging;

namespace Movies.Tests;

public class CustomWebAppFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder
        //  .UseEnvironment("Testing") - TODO: połączenie do bazy testowej
            .ConfigureLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddFilter("Microsoft", LogLevel.Error);
                logging.AddFilter("System", LogLevel.Error);
                logging.AddFilter("Hangfire", LogLevel.Error);
                logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Error);
            }));
    }
}