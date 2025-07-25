﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Movies.Infrastructure;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("CategoryMovie", b =>
                {
                    b.Property<Guid>("CategoriesCategoryId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("MoviesMovieId")
                        .HasColumnType("char(36)");

                    b.HasKey("CategoriesCategoryId", "MoviesMovieId");

                    b.HasIndex("MoviesMovieId");

                    b.ToTable("CategoryMovie");
                });

            modelBuilder.Entity("CountryMovie", b =>
                {
                    b.Property<Guid>("CountriesCountryId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("MoviesMovieId")
                        .HasColumnType("char(36)");

                    b.HasKey("CountriesCountryId", "MoviesMovieId");

                    b.HasIndex("MoviesMovieId");

                    b.ToTable("CountryMovie");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("longtext");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("RoleId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Value")
                        .HasColumnType("longtext");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("MovieMovieCollection", b =>
                {
                    b.Property<Guid>("MovieCollectionsMovieCollectionId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("MoviesMovieId")
                        .HasColumnType("char(36)");

                    b.HasKey("MovieCollectionsMovieCollectionId", "MoviesMovieId");

                    b.HasIndex("MoviesMovieId");

                    b.ToTable("MovieMovieCollection");
                });

            modelBuilder.Entity("MovieRecommendationUser", b =>
                {
                    b.Property<string>("LikedByUsersId")
                        .HasColumnType("varchar(255)");

                    b.Property<Guid>("LikedRecommendationsRecommendationId")
                        .HasColumnType("char(36)");

                    b.HasKey("LikedByUsersId", "LikedRecommendationsRecommendationId");

                    b.HasIndex("LikedRecommendationsRecommendationId");

                    b.ToTable("MovieRecommendationUser");
                });

            modelBuilder.Entity("MovieUser", b =>
                {
                    b.Property<Guid>("FollowedMoviesMovieId")
                        .HasColumnType("char(36)");

                    b.Property<string>("FollowersId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("FollowedMoviesMovieId", "FollowersId");

                    b.HasIndex("FollowersId");

                    b.ToTable("ReleaseFollowers", (string)null);
                });

            modelBuilder.Entity("Movies.Domain.Entities.Achievement", b =>
                {
                    b.Property<Guid>("AchievementId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("AchievementId");

                    b.ToTable("Achievements");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Category", b =>
                {
                    b.Property<Guid>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Country", b =>
                {
                    b.Property<Guid>("CountryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("CountryId");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Movie", b =>
                {
                    b.Property<Guid>("MovieId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Duration")
                        .HasColumnType("int");

                    b.Property<string>("PosterUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("MovieId");

                    b.ToTable("Movies");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollection", b =>
                {
                    b.Property<Guid>("MovieCollectionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<bool>("AllowCopy")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("LikesCounter")
                        .HasColumnType("int");

                    b.Property<int>("ShareMode")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("MovieCollectionId");

                    b.HasIndex("UserId");

                    b.ToTable("MovieCollections");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollectionReview", b =>
                {
                    b.Property<Guid>("MovieCollectionReviewId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("LikesCounter")
                        .HasColumnType("int");

                    b.Property<Guid>("MovieCollectionId")
                        .HasColumnType("char(36)");

                    b.Property<float>("Rating")
                        .HasColumnType("float");

                    b.Property<bool>("Spoilers")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("MovieCollectionReviewId");

                    b.HasIndex("MovieCollectionId");

                    b.HasIndex("UserId");

                    b.ToTable("MovieCollectionReviews");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollectionReviewReply", b =>
                {
                    b.Property<Guid>("ReplyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("ReviewMovieCollectionReviewId")
                        .HasColumnType("char(36)");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("ReplyId");

                    b.HasIndex("ReviewMovieCollectionReviewId");

                    b.HasIndex("UserId");

                    b.ToTable("MovieCollectionReviewReplies");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MoviePerson", b =>
                {
                    b.Property<Guid>("MoviePersonId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("MovieId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("PersonId")
                        .HasColumnType("char(36)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.HasKey("MoviePersonId");

                    b.HasIndex("MovieId");

                    b.HasIndex("PersonId");

                    b.ToTable("MoviePeople");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieRecommendation", b =>
                {
                    b.Property<Guid>("RecommendationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("LikesCounter")
                        .HasColumnType("int");

                    b.Property<Guid>("MovieId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("RecommendedMovieId")
                        .HasColumnType("char(36)");

                    b.HasKey("RecommendationId");

                    b.HasIndex("RecommendedMovieId");

                    b.HasIndex("MovieId", "RecommendedMovieId")
                        .IsUnique();

                    b.ToTable("MovieRecommendations");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Notification", b =>
                {
                    b.Property<Guid>("NotificationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<bool>("IsRead")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Resource")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("SourceUserId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("TargetUserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("NotificationId");

                    b.HasIndex("SourceUserId");

                    b.HasIndex("TargetUserId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Person", b =>
                {
                    b.Property<Guid>("PersonId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Bio")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PhotoUrl")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("PersonId");

                    b.ToTable("People");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Reply", b =>
                {
                    b.Property<Guid>("ReplyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("ReviewId")
                        .HasColumnType("char(36)");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("ReplyId");

                    b.HasIndex("ReviewId");

                    b.HasIndex("UserId");

                    b.ToTable("Replies");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Review", b =>
                {
                    b.Property<Guid>("ReviewId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("MovieId")
                        .HasColumnType("char(36)");

                    b.Property<float>("Rating")
                        .HasColumnType("float");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("ReviewId");

                    b.HasIndex("MovieId");

                    b.HasIndex("UserId");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("Movies.Domain.Entities.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("longtext");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsGoogleUser")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("longtext");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<int>("UserRole")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Movies.Domain.Entities.UserAchievement", b =>
                {
                    b.Property<Guid>("UserAchievementId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("AchievementId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("UserAchievementId");

                    b.HasIndex("AchievementId");

                    b.HasIndex("UserId");

                    b.ToTable("UserAchievements");
                });

            modelBuilder.Entity("Movies.Domain.Entities.UserRelation", b =>
                {
                    b.Property<Guid>("UserRelationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("FirstUserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("SecondUserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("UserRelationId");

                    b.HasIndex("FirstUserId");

                    b.HasIndex("SecondUserId");

                    b.ToTable("UserRelations");
                });

            modelBuilder.Entity("PersonUser", b =>
                {
                    b.Property<Guid>("FollowedPeoplePersonId")
                        .HasColumnType("char(36)");

                    b.Property<string>("FollowersId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("FollowedPeoplePersonId", "FollowersId");

                    b.HasIndex("FollowersId");

                    b.ToTable("Followers", (string)null);
                });

            modelBuilder.Entity("CategoryMovie", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoriesCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CountryMovie", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Country", null)
                        .WithMany()
                        .HasForeignKey("CountriesCountryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MovieMovieCollection", b =>
                {
                    b.HasOne("Movies.Domain.Entities.MovieCollection", null)
                        .WithMany()
                        .HasForeignKey("MovieCollectionsMovieCollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MovieRecommendationUser", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("LikedByUsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.MovieRecommendation", null)
                        .WithMany()
                        .HasForeignKey("LikedRecommendationsRecommendationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MovieUser", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Movie", null)
                        .WithMany()
                        .HasForeignKey("FollowedMoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("FollowersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollection", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", "User")
                        .WithMany("MovieCollections")
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollectionReview", b =>
                {
                    b.HasOne("Movies.Domain.Entities.MovieCollection", "MovieCollection")
                        .WithMany("MovieCollectionReviews")
                        .HasForeignKey("MovieCollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", "User")
                        .WithMany("MovieCollectionReviews")
                        .HasForeignKey("UserId");

                    b.Navigation("MovieCollection");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollectionReviewReply", b =>
                {
                    b.HasOne("Movies.Domain.Entities.MovieCollectionReview", "Review")
                        .WithMany("Replies")
                        .HasForeignKey("ReviewMovieCollectionReviewId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", "User")
                        .WithMany("MovieCollectionReviewReplies")
                        .HasForeignKey("UserId");

                    b.Navigation("Review");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MoviePerson", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Movie", "Movie")
                        .WithMany("MoviePerson")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.Person", "Person")
                        .WithMany("MoviePerson")
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Movie");

                    b.Navigation("Person");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieRecommendation", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Movie", "Movie")
                        .WithMany("Recommendations")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.Movie", "RecommendedMovie")
                        .WithMany("RecommendedBy")
                        .HasForeignKey("RecommendedMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Movie");

                    b.Navigation("RecommendedMovie");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Notification", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", "SourceUser")
                        .WithMany("UserNotificationFrom")
                        .HasForeignKey("SourceUserId");

                    b.HasOne("Movies.Domain.Entities.User", "TargetUser")
                        .WithMany("UserNotificationTo")
                        .HasForeignKey("TargetUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SourceUser");

                    b.Navigation("TargetUser");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Reply", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Review", "Review")
                        .WithMany("Replies")
                        .HasForeignKey("ReviewId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", "User")
                        .WithMany("Replies")
                        .HasForeignKey("UserId");

                    b.Navigation("Review");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Review", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Movie", "Movie")
                        .WithMany("Reviews")
                        .HasForeignKey("MovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", "User")
                        .WithMany("Reviews")
                        .HasForeignKey("UserId");

                    b.Navigation("Movie");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Movies.Domain.Entities.UserAchievement", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Achievement", "Achievement")
                        .WithMany("UserAchievements")
                        .HasForeignKey("AchievementId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", "User")
                        .WithMany("UserAchievements")
                        .HasForeignKey("UserId");

                    b.Navigation("Achievement");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Movies.Domain.Entities.UserRelation", b =>
                {
                    b.HasOne("Movies.Domain.Entities.User", "FirstUser")
                        .WithMany("UserRelationsFrom")
                        .HasForeignKey("FirstUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", "SecondUser")
                        .WithMany("UserRelationsTo")
                        .HasForeignKey("SecondUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FirstUser");

                    b.Navigation("SecondUser");
                });

            modelBuilder.Entity("PersonUser", b =>
                {
                    b.HasOne("Movies.Domain.Entities.Person", null)
                        .WithMany()
                        .HasForeignKey("FollowedPeoplePersonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("FollowersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Movies.Domain.Entities.Achievement", b =>
                {
                    b.Navigation("UserAchievements");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Movie", b =>
                {
                    b.Navigation("MoviePerson");

                    b.Navigation("Recommendations");

                    b.Navigation("RecommendedBy");

                    b.Navigation("Reviews");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollection", b =>
                {
                    b.Navigation("MovieCollectionReviews");
                });

            modelBuilder.Entity("Movies.Domain.Entities.MovieCollectionReview", b =>
                {
                    b.Navigation("Replies");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Person", b =>
                {
                    b.Navigation("MoviePerson");
                });

            modelBuilder.Entity("Movies.Domain.Entities.Review", b =>
                {
                    b.Navigation("Replies");
                });

            modelBuilder.Entity("Movies.Domain.Entities.User", b =>
                {
                    b.Navigation("MovieCollectionReviewReplies");

                    b.Navigation("MovieCollectionReviews");

                    b.Navigation("MovieCollections");

                    b.Navigation("Replies");

                    b.Navigation("Reviews");

                    b.Navigation("UserAchievements");

                    b.Navigation("UserNotificationFrom");

                    b.Navigation("UserNotificationTo");

                    b.Navigation("UserRelationsFrom");

                    b.Navigation("UserRelationsTo");
                });
#pragma warning restore 612, 618
        }
    }
}
