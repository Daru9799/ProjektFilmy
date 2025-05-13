using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NullableSourceUserNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_SourceUserId",
                table: "Notifications");

            migrationBuilder.AlterColumn<string>(
                name: "SourceUserId",
                table: "Notifications",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_SourceUserId",
                table: "Notifications",
                column: "SourceUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_AspNetUsers_SourceUserId",
                table: "Notifications");

            migrationBuilder.UpdateData(
                table: "Notifications",
                keyColumn: "SourceUserId",
                keyValue: null,
                column: "SourceUserId",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "SourceUserId",
                table: "Notifications",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_AspNetUsers_SourceUserId",
                table: "Notifications",
                column: "SourceUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
