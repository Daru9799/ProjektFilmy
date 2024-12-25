using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;

namespace Movies.Infrastructure
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options) { }

        //TUTAJ SĄ TABELE
        public DbSet<Movie> Movies { get; set; }    
        public DbSet<Category> Categories { get; set; }
        public DbSet<Country> Countries { get; set; }
    }
}
