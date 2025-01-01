using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ActorAndDirectorUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DirectorName",
                table: "Directors",
                newName: "PhotoUrl");

            migrationBuilder.RenameColumn(
                name: "CountryName",
                table: "Countries",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "CategoryName",
                table: "Categories",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "ActorName",
                table: "Actors",
                newName: "PhotoUrl");

            migrationBuilder.RenameColumn(
                name: "ActorLastName",
                table: "Actors",
                newName: "LastName");

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Directors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDate",
                table: "Directors",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Directors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Directors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Actors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "BirthDate",
                table: "Actors",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Actors",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Directors");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Actors");

            migrationBuilder.DropColumn(
                name: "BirthDate",
                table: "Actors");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Actors");

            migrationBuilder.RenameColumn(
                name: "PhotoUrl",
                table: "Directors",
                newName: "DirectorName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Countries",
                newName: "CountryName");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Categories",
                newName: "CategoryName");

            migrationBuilder.RenameColumn(
                name: "PhotoUrl",
                table: "Actors",
                newName: "ActorName");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Actors",
                newName: "ActorLastName");
        }
    }
}
