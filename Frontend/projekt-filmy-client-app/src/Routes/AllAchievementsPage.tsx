import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAchievements } from "../API/AchievementApi";
import "../styles/AchievementCard.css";
import PaginationModule from "../components/SharedModals/PaginationModule";
import SpinnerLoader from "../components/SpinnerLoader";

const AllAchievementsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ totalItems: 1, pageNumber: 1, pageSize: 9, totalPages: 1 });
  const loggedUserName = localStorage.getItem("logged_username");

  //Ustawiam domyslnie bez useState bo i tak nie ma tutaj zadnego sortowania (potem mozna zmienic)
  const sortOrder = "date";
  const sortDirection = "desc";

  //API hook
  const { data: paginatedAchievements, isLoading: loadingAchievements, error: achievementsError } = useAchievements(
    pagination.pageNumber,
    pagination.pageSize,
    sortOrder,
    sortDirection
  );

  const achievements = paginatedAchievements?.achievements ?? [];
  const totalPages = paginatedAchievements?.totalPages ?? 1;

  if (loadingAchievements) {
    return <SpinnerLoader />;
  }

  if (achievementsError) {
    return <div className="text-danger text-center">Wystąpił błąd</div>;
  }

  return (
    <div className="container d-flex flex-column" style={{ minHeight: "90vh" }}>
      <div className="flex-grow-1">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginBottom: "5%",
            marginTop: "3%",
          }}
        >
          <h2 style={{ color: "white", margin: 0 }}>Wszystkie osiągnięcia:</h2>

          {loggedUserName && (
            <button
              onClick={() => navigate(`/user/achievements/${loggedUserName}`)}
              className="btn btn-outline-light mt-3"
              style={{
                position: "absolute",
                right: 0,
              }}
            >
              Moje osiągnięcia
            </button>
          )}
        </div>

        <div className="row">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div className="col-md-4 mb-3" key={achievement.achievementId}>
                <div className="achievement-card">
                  <div className="card-body">
                    <h5 className="card-title">{achievement.title}</h5>
                    <p className="card-description">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">Brak osiągnięć do wyświetlenia.</p>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

export default AllAchievementsPage;