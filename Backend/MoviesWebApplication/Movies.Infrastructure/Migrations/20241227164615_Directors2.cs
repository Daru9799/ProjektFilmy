using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Directors2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DirectorMovie_Director_DirectorsDirectorId",
                table: "DirectorMovie");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Director",
                table: "Director");

            migrationBuilder.RenameTable(
                name: "Director",
                newName: "Directors");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Directors",
                table: "Directors",
                column: "DirectorId");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectorMovie_Directors_DirectorsDirectorId",
                table: "DirectorMovie",
                column: "DirectorsDirectorId",
                principalTable: "Directors",
                principalColumn: "DirectorId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DirectorMovie_Directors_DirectorsDirectorId",
                table: "DirectorMovie");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Directors",
                table: "Directors");

            migrationBuilder.RenameTable(
                name: "Directors",
                newName: "Director");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Director",
                table: "Director",
                column: "DirectorId");

            migrationBuilder.AddForeignKey(
                name: "FK_DirectorMovie_Director_DirectorsDirectorId",
                table: "DirectorMovie",
                column: "DirectorsDirectorId",
                principalTable: "Director",
                principalColumn: "DirectorId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
