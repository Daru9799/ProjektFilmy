using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoviesCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MoviesCollections",
                columns: table => new
                {
                    MoviesCollectionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ShareMode = table.Column<int>(type: "int", nullable: false),
                    AllowCopy = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    LikesCounter = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoviesCollections", x => x.MoviesCollectionId);
                    table.ForeignKey(
                        name: "FK_MoviesCollections_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MovieMoviesCollection",
                columns: table => new
                {
                    MoviesCollectionsMoviesCollectionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MoviesMovieId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieMoviesCollection", x => new { x.MoviesCollectionsMoviesCollectionId, x.MoviesMovieId });
                    table.ForeignKey(
                        name: "FK_MovieMoviesCollection_MoviesCollections_MoviesCollectionsMov~",
                        column: x => x.MoviesCollectionsMoviesCollectionId,
                        principalTable: "MoviesCollections",
                        principalColumn: "MoviesCollectionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieMoviesCollection_Movies_MoviesMovieId",
                        column: x => x.MoviesMovieId,
                        principalTable: "Movies",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_MovieMoviesCollection_MoviesMovieId",
                table: "MovieMoviesCollection",
                column: "MoviesMovieId");

            migrationBuilder.CreateIndex(
                name: "IX_MoviesCollections_UserId",
                table: "MoviesCollections",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieMoviesCollection");

            migrationBuilder.DropTable(
                name: "MoviesCollections");
        }
    }
}
