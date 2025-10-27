import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAchievements } from "../API/AchievementApi";
import "../styles/AchievementCard.css";
import PaginationModule from "../components/SharedModals/PaginationModule";
import SpinnerLoader from "../components/SpinnerLoader";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

const AllAchievementsPage = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ totalItems: 1, pageNumber: 1, pageSize: 9, totalPages: 1 });
  const loggedUserName = localStorage.getItem("logged_username");

  //Ustawiam domyslnie bez useState bo i tak nie ma tutaj zadnego sortowania (potem mozna zmienic)
  const sortOrder = "date";
  const sortDirection = "desc";

  //API hook
  const { data: paginatedAchievements, isLoading: loadingAchievements, apiError: achievementsError } = useAchievements(
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

return (
  <div className="container d-flex flex-column" style={{ minHeight: "90vh" }}>
    <ApiErrorDisplay apiError={achievementsError}>
      <div className="flex-grow-1">

        <div
          className="d-flex align-items-center justify-content-between flex-wrap mb-4 mt-3"
          style={{ gap: "10px" }}
        >
          <h2
            className="text-center flex-grow-1"
            style={{
              color: "white",
              margin: 0,
              fontSize: "1.5rem",
              wordBreak: "break-word",
            }}
          >
            Wszystkie osiągnięcia:
          </h2>

          {loggedUserName && (
            <div className="w-100 d-flex justify-content-center justify-content-md-end mt-2 mt-md-0">
              <button
                onClick={() => navigate(`/user/achievements/${loggedUserName}`)}
                className="btn btn-outline-light"
                style={{ whiteSpace: "nowrap" }}
              >
                Moje osiągnięcia
              </button>
            </div>
          )}
        </div>

        <div className="row">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div className="col-md-4 mb-3" key={achievement.achievementId}>
                <div className="achievement-card">
                  <div className="card-body text-center">
                    {achievement.imageUrl && (
                      <img
                        src={achievement.imageUrl}
                        alt={achievement.title}
                        className="img-fluid mb-3 rounded"
                        style={{ maxHeight: "50px", objectFit: "cover" }}
                      />
                    )}
                    <h5 className="card-title">{achievement.title}</h5>
                    <p className="card-description mt-3">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-warning fs-4">
              Brak osiągnięć do wyświetlenia.
            </p>
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
    </ApiErrorDisplay>
  </div>
);

};

export default AllAchievementsPage;