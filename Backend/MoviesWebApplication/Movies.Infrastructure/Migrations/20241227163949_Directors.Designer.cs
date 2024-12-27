﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Movies.Infrastructure;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20241227163949_Directors")]
    partial class Directors
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("CategoryMovie", b =>
                {
                    b.Property<Guid>("CategoriesCategoryId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("MoviesMovieId")
                        .HasColumnType("TEXT");

                    b.HasKey("CategoriesCategoryId", "MoviesMovieId");

                    b.HasIndex("MoviesMovieId");

                    b.ToTable("CategoryMovie");
                });

            modelBuilder.Entity("CountryMovie", b =>
                {
                    b.Property<Guid>("CountriesCountryId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("MoviesMovieId")
                        .HasColumnType("TEXT");

                    b.HasKey("CountriesCountryId", "MoviesMovieId");

                    b.HasIndex("MoviesMovieId");

                    b.ToTable("CountryMovie");
                });

            modelBuilder.Entity("DirectorMovie", b =>
                {
                    b.Property<Guid>("DirectorsDirectorId")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("MoviesMovieId")
                        .HasColumnType("TEXT");

                    b.HasKey("DirectorsDirectorId", "MoviesMovieId");

                    b.HasIndex("MoviesMovieId");

                    b.ToTable("DirectorMovie");
                });

            modelBuilder.Entity("Movies.Domain.Category", b =>
                {
                    b.Property<Guid>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("CategoryName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("CategoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("Movies.Domain.Country", b =>
                {
                    b.Property<Guid>("CountryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("CountryName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("CountryId");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("Movies.Domain.Director", b =>
                {
                    b.Property<Guid>("DirectorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("DirectorName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("DirectorId");

                    b.ToTable("Director");
                });

            modelBuilder.Entity("Movies.Domain.Movie", b =>
                {
                    b.Property<Guid>("MovieId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("PosterUrl")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("ReleaseDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("MovieId");

                    b.ToTable("Movies");
                });

            modelBuilder.Entity("CategoryMovie", b =>
                {
                    b.HasOne("Movies.Domain.Category", null)
                        .WithMany()
                        .HasForeignKey("CategoriesCategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("CountryMovie", b =>
                {
                    b.HasOne("Movies.Domain.Country", null)
                        .WithMany()
                        .HasForeignKey("CountriesCountryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DirectorMovie", b =>
                {
                    b.HasOne("Movies.Domain.Director", null)
                        .WithMany()
                        .HasForeignKey("DirectorsDirectorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Movies.Domain.Movie", null)
                        .WithMany()
                        .HasForeignKey("MoviesMovieId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
