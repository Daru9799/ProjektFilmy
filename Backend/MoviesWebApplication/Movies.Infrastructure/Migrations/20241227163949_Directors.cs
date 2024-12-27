using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Directors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Director",
                columns: table => new
                {
                    DirectorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DirectorName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Director", x => x.DirectorId);
                });

            migrationBuilder.CreateTable(
                name: "DirectorMovie",
                columns: table => new
                {
                    DirectorsDirectorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MoviesMovieId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DirectorMovie", x => new { x.DirectorsDirectorId, x.MoviesMovieId });
                    table.ForeignKey(
                        name: "FK_DirectorMovie_Director_DirectorsDirectorId",
                        column: x => x.DirectorsDirectorId,
                        principalTable: "Director",
                        principalColumn: "DirectorId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DirectorMovie_Movies_MoviesMovieId",
                        column: x => x.MoviesMovieId,
                        principalTable: "Movies",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DirectorMovie_MoviesMovieId",
                table: "DirectorMovie",
                column: "MoviesMovieId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DirectorMovie");

            migrationBuilder.DropTable(
                name: "Director");
        }
    }
}
