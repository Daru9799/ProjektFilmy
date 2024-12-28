using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Movies.Infrastructure;
using Movies.Application.Movies;
using MoviesWebApplication;
using Microsoft.AspNetCore.Identity;
using Movies.Domain;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Kontekst bazy danych
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Autentykacja, logowanie, rejestracja 
builder.Services.AddIdentityServices(builder.Configuration);

//Rejestracja mediatora
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MoviesList.Handler).Assembly));

//Naprawienie bledu z poprawnym wyswietlaniem obiektów z innych tabel
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    });

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:7072");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//TWORZENIE BAZY DANYCH PUNKT 10
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

app.Run();
