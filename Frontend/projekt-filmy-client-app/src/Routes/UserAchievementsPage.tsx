import { useState } from "react";
import "../styles/AchievementCard.css";
import { useParams, useNavigate } from "react-router-dom";
import PaginationModule from "../components/SharedModals/PaginationModule";
import { useUserAchievements } from "../API/AchievementApi";
import SpinnerLoader from "../components/SpinnerLoader";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

const UserAchievementsPage = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ totalItems: 1, pageNumber: 1, pageSize: 9, totalPages: 1 });

  //Ustawiam domyslnie bez useState bo i tak nie ma tutaj zadnego sortowania (potem mozna zmienic)
  const sortOrder = "date";
  const sortDirection = "desc";

  //API hook
  const { data: paginatedAchievements, isLoading, apiError: achievementError  } = useUserAchievements(
    userName ?? "",
    pagination.pageNumber,
    pagination.pageSize,
    sortOrder,
    sortDirection
  );

  const achievements = paginatedAchievements?.achievements ?? [];
  const totalPages = paginatedAchievements?.totalPages ?? 1;

  const loggedUserName = localStorage.getItem("logged_username");

  if (isLoading) return <SpinnerLoader />;

  return (
    <div className="container d-flex flex-column" style={{ minHeight: "90vh" }}>
    <ApiErrorDisplay apiError={achievementError}>
      <div className="flex-grow-1">
        <div style={{ position: "relative", marginBottom: "5%", marginTop: "3%" }}>
          <button
            className="btn btn-secondary"
            style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
            onClick={() => navigate(`/user/${userName}`)}
          >
            <i className="fas fa-arrow-left"></i>
          </button>

          <h2 style={{ color: "white", textAlign: "center", margin: 0 }}>
            {loggedUserName === userName
              ? "Twoje osiągnięcia:"
              : <>Osiągnięcia użytkownika <strong>{userName}</strong></>}
          </h2>
        </div>
          <div className="row">
            {achievements.length > 0 ? (
              achievements.map((userAchievement) => (
                <div className="col-md-4 mb-3" key={userAchievement.userAchievementId}>
                  <div className="achievement-card position-relative">
                    <span className="achievement-date">
                      {new Date(userAchievement.date).toLocaleDateString()}
                    </span>
                    <div className="card-body">
                      {userAchievement.achievement.imageUrl && (
                    <img
                    src={userAchievement.achievement.imageUrl}
                    alt={userAchievement.achievement.title}
                    className="img-fluid mb-3 rounded"
                    style={{ maxHeight: "50px", objectFit: "cover" }}
                      />
                     )}
                      <h5 className="card-title">{userAchievement.achievement.title}</h5>
                      <p className="card-description">{userAchievement.achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-warning fs-4">Brak osiągnięć do wyświetlenia</p>
            )}
          </div>
      </div>

      <div className="mt-auto">
        {achievements.length > 0 && (
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
        )}
      </div>
    </ApiErrorDisplay>
    </div>
  );
};

export default UserAchievementsPage;