using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Movies.Domain;

namespace Movies.Infrastructure
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options) { }

        //TUTAJ SĄ TABELE
        public DbSet<Movie> Movies { get; set; }    
        public DbSet<Category> Categories { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Review> Reviews { get; set; }
        //NOWE
        public DbSet<MovieCollection> MovieCollections { get; set; }
        public DbSet<Reply> Replies { get; set; }
        public DbSet<UserRelation> UserRelations { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }
        public DbSet<MovieCollectionReview> MovieCollectionReviews { get; set; }
        public DbSet<MovieCollectionReviewReply> MovieCollectionReviewReplies { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<MoviePerson> MoviePeople { get; set; }
        public DbSet<MovieRecommendation> MovieRecommendations { get; set; }

        //Zdefiniowane ręcznie kluczy obcych w tabelce UserRelations oraz Notifications
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRelation>()
                        .HasOne(u => u.FirstUser)
                        .WithMany(u => u.UserRelationsFrom)
                        .HasForeignKey(m => m.FirstUserId);

            modelBuilder.Entity<UserRelation>()
                        .HasOne(m => m.SecondUser)
                        .WithMany(u => u.UserRelationsTo)
                        .HasForeignKey(m => m.SecondUserId);

            modelBuilder.Entity<Notification>()
                        .HasOne(u => u.SourceUser)
                        .WithMany(u => u.UserNotificationFrom)
                        .HasForeignKey(m => m.SourceUserId);

            modelBuilder.Entity<Notification>()
                        .HasOne(m => m.TargetUser)
                        .WithMany(u => u.UserNotificationTo)
                        .HasForeignKey(m => m.TargetUserId);

            modelBuilder.Entity<MovieRecommendation>()
                        .HasOne(m => m.Movie)
                        .WithMany(m => m.Recommendations)
                        .HasForeignKey(m => m.MovieId);

            modelBuilder.Entity<MovieRecommendation>()
                .HasOne(m => m.RecommendedMovie)
                .WithMany(m => m.RecommendedBy)
                .HasForeignKey(m => m.RecommendedMovieId);

            //Wymuszenie aby nie mozna bylo powtarzac rekomendacji (każda rekomendacja między dwoma filmami tylko raz)
            modelBuilder.Entity<MovieRecommendation>()
                .HasIndex(m => new { m.MovieId, m.RecommendedMovieId })
                .IsUnique();

            //Wymuszenie aby tabela posredniczaca userow obserwujacych osoby kina miala nazwe Followers z filmami to samo 
            modelBuilder.Entity<User>()
                .HasMany(u => u.FollowedPeople)
                .WithMany(p => p.Followers)
                .UsingEntity(j => j.ToTable("Followers"));

            modelBuilder.Entity<User>()
                .HasMany(u => u.FollowedMovies)
                .WithMany(m => m.Followers)
                .UsingEntity(j => j.ToTable("ReleaseFollowers"));
        }
    }
}
