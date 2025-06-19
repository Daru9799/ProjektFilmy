using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Movies.Infrastructure;
using Movies.Application.Movies;
using MoviesWebApplication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Movies.Domain.Entities;
using MoviesWebApplication.Hubs;
using Movies.Application.Interfaces;
using MoviesWebApplication.SignalR;
using Hangfire;
using Hangfire.MySql;
using MoviesWebApplication.Hangfire;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//HttpContextAccessor
builder.Services.AddHttpContextAccessor();

// HangFire - dane w appsettings.json
/*builder.Services.AddHangfire(configuration =>
    configuration.UseStorage(new MySqlStorage(
        builder.Configuration.GetConnectionString("HangfireConnection"),
        new MySqlStorageOptions()
    )));

builder.Services.AddHangfireServer();*/


//SingnalR
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

builder.Services.AddScoped<INotificationSender, SignalRNotificationSender>();
builder.Services.AddScoped<DailyPremiereNotificationJob>();

//Kontekst bazy danych
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 35)));
});

//Autentykacja, logowanie, rejestracja 
builder.Services.AddIdentityServices(builder.Configuration);

//Rejestracja mediatora
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MoviesList.Handler).Assembly));


builder.Services.AddControllers(opt =>
{
    //Dodanie globalnej polityki autoryzacji
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
//Naprawienie bledu z poprawnym wyswietlaniem obiektów z innych tabel
.AddJsonOptions(options =>
{
    //Konfiguracja serializacji JSON
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") //Adres dla frontu
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

/*app.UseHangfireDashboard(); // https://localhost:7053/hangfire

RecurringJob.AddOrUpdate<DailyPremiereNotificationJob>(
    "daily-premiere-job",
    job => job.ExecuteAsync(),
    "0 1 * * *", // codziennie o 01:00
    TimeZoneInfo.Local
);*/


app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<User>>();

    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Error");
}

//WebScoket zeby SignalR dzialał
app.UseWebSockets();

//Rejestracja endpointu SignalR dla powiadomien w czasie rzeczywistym pod adresem /notificationHub
app.MapHub<NotificationHub>("/notificationHub");

app.Run();
