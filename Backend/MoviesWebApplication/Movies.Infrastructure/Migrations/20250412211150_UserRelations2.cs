using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UserRelations2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_AspNetUsers_FirstUserId",
                table: "UserRelations");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_AspNetUsers_SecondUserId",
                table: "UserRelations");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_AspNetUsers_UserId",
                table: "UserRelations");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_AspNetUsers_UserId1",
                table: "UserRelations");

            migrationBuilder.DropIndex(
                name: "IX_UserRelations_UserId",
                table: "UserRelations");

            migrationBuilder.DropIndex(
                name: "IX_UserRelations_UserId1",
                table: "UserRelations");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserRelations");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserRelations");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_AspNetUsers_FirstUserId",
                table: "UserRelations",
                column: "FirstUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_AspNetUsers_SecondUserId",
                table: "UserRelations",
                column: "SecondUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_AspNetUsers_FirstUserId",
                table: "UserRelations");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_AspNetUsers_SecondUserId",
                table: "UserRelations");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "UserRelations",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                table: "UserRelations",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_UserRelations_UserId",
                table: "UserRelations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRelations_UserId1",
                table: "UserRelations",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_AspNetUsers_FirstUserId",
                table: "UserRelations",
                column: "FirstUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_AspNetUsers_SecondUserId",
                table: "UserRelations",
                column: "SecondUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_AspNetUsers_UserId",
                table: "UserRelations",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_AspNetUsers_UserId1",
                table: "UserRelations",
                column: "UserId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
