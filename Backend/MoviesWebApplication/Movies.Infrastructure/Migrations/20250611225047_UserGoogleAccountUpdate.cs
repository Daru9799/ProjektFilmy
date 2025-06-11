using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UserGoogleAccountUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGoogleUser",
                table: "AspNetUsers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsGoogleUser",
                table: "AspNetUsers");
        }
    }
}
