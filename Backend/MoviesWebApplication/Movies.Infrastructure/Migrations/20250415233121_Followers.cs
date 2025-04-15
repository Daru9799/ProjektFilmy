using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Movies.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Followers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Followers",
                columns: table => new
                {
                    FollowedPeoplePersonId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FollowersId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Followers", x => new { x.FollowedPeoplePersonId, x.FollowersId });
                    table.ForeignKey(
                        name: "FK_Followers_AspNetUsers_FollowersId",
                        column: x => x.FollowersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Followers_People_FollowedPeoplePersonId",
                        column: x => x.FollowedPeoplePersonId,
                        principalTable: "People",
                        principalColumn: "PersonId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MovieRecommendationUser",
                columns: table => new
                {
                    LikedByUsersId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LikedRecommendationsRecommendationId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieRecommendationUser", x => new { x.LikedByUsersId, x.LikedRecommendationsRecommendationId });
                    table.ForeignKey(
                        name: "FK_MovieRecommendationUser_AspNetUsers_LikedByUsersId",
                        column: x => x.LikedByUsersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MovieRecommendationUser_MovieRecommendations_LikedRecommenda~",
                        column: x => x.LikedRecommendationsRecommendationId,
                        principalTable: "MovieRecommendations",
                        principalColumn: "RecommendationId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ReleaseFollowers",
                columns: table => new
                {
                    FollowedMoviesMovieId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FollowersId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReleaseFollowers", x => new { x.FollowedMoviesMovieId, x.FollowersId });
                    table.ForeignKey(
                        name: "FK_ReleaseFollowers_AspNetUsers_FollowersId",
                        column: x => x.FollowersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReleaseFollowers_Movies_FollowedMoviesMovieId",
                        column: x => x.FollowedMoviesMovieId,
                        principalTable: "Movies",
                        principalColumn: "MovieId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Followers_FollowersId",
                table: "Followers",
                column: "FollowersId");

            migrationBuilder.CreateIndex(
                name: "IX_MovieRecommendationUser_LikedRecommendationsRecommendationId",
                table: "MovieRecommendationUser",
                column: "LikedRecommendationsRecommendationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReleaseFollowers_FollowersId",
                table: "ReleaseFollowers",
                column: "FollowersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Followers");

            migrationBuilder.DropTable(
                name: "MovieRecommendationUser");

            migrationBuilder.DropTable(
                name: "ReleaseFollowers");
        }
    }
}
