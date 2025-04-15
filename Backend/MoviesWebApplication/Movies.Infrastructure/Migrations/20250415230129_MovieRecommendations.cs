using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MovieRecommendations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MovieRecommendations",
                columns: table => new
                {
                    RecommendationId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LikesCounter = table.Column<int>(type: "int", nullable: false),
                    MovieId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    RecommendedMovieId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieRecommendations", x => x.RecommendationId);
                    table.ForeignKey(
                        name: "FK_MovieRecommendations_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieRecommendations_Movies_RecommendedMovieId",
                        column: x => x.RecommendedMovieId,
                        principalTable: "Movies",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_MovieRecommendations_MovieId_RecommendedMovieId",
                table: "MovieRecommendations",
                columns: new[] { "MovieId", "RecommendedMovieId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MovieRecommendations_RecommendedMovieId",
                table: "MovieRecommendations",
                column: "RecommendedMovieId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieRecommendations");
        }
    }
}
