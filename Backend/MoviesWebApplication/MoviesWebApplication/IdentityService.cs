using System.Runtime.CompilerServices;
using Movies.Domain;
using Movies.Infrastructure;

namespace MoviesWebApplication
{
    public static class IdentityService
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<User>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
                .AddEntityFrameworkStores<DataContext>();
            return services;
        }
    }
}
