using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Movies.Infrastructure;
using Movies.Application.Movies;
using MoviesWebApplication;
using Microsoft.AspNetCore.Identity;
using Movies.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Dodaj HttpContextAccessor
builder.Services.AddHttpContextAccessor();

//Kontekst bazy danych
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//Autentykacja, logowanie, rejestracja 
builder.Services.AddIdentityServices(builder.Configuration);

//Rejestracja mediatora
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(MoviesList.Handler).Assembly));


builder.Services.AddControllers(opt =>
{
    // Dodanie globalnej polityki autoryzacji
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
})
//Naprawienie bledu z poprawnym wyswietlaniem obiektów z innych tabel
.AddJsonOptions(options =>
{
    // Konfiguracja serializacji JSON
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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

app.UseAuthentication();

app.UseAuthorization();

app.UseCors("AllowAll");

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
