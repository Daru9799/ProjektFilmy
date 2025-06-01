import { useEffect, useState } from "react";
import { UserAchievement } from "../../models/UserAchievement";
import PaginationModule from "../PaginationModule";
import { fetchUserAchievements } from "../../API/achievementApi";
import "../../styles/AchievementCard.css";
import { useParams, useNavigate } from "react-router-dom";

const UserAchievements = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 9,
    totalPages: 1,
  });

  const [sortOrder] = useState<string>("date");
  const [sortDirection] = useState<string>("desc");

const loggedUserName = localStorage.getItem("logged_username");
  

  useEffect(() => {
    if (!userName) {
      setError("Brak identyfikatora użytkownika.");
      setLoading(false);
      return;
    }

    fetchUserAchievements(
      pagination.pageNumber,
      pagination.pageSize,
      sortOrder,
      sortDirection,
      setAchievements,
      setPagination,
      setError,
      setLoading,
      userName
    );
  }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection, userName, navigate]);

  if (loading) {
    return <div className="text-center">Ładowanie osiągnięć...</div>;
  }

if (error) {
  if (error.includes("404")) {
    return (
      <div className="text-center text-warning" style={{ marginTop: "20vh",  minHeight:'90vh'}}>
        <h2>404 - Nie znaleziono osiągnięć</h2>
        <p>Nie znaleziono użytkownika lub jego osiągnięć.</p>
      </div>
    );
  }
  return <div className="text-danger text-center">{error}</div>;
}

  return (
    <div className="container d-flex flex-column" style={{ minHeight: "90vh" }}>
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
                    <h5 className="card-title">{userAchievement.achievement.title}</h5>
                    <p className="card-description">{userAchievement.achievement.description}</p>
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
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

export default UserAchievements;
