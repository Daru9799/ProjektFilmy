import { useEffect, useState } from "react";
import { Achievement } from "../../models/Achievement";
import PaginationModule from "../PaginationModule";
import { fetchAchievements } from "../../API/achievementApi"
import "../../styles/AchievementCard.css"

const AllAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
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

  useEffect(() => {
    fetchAchievements(
      pagination.pageNumber,
      pagination.pageSize,
      sortOrder,
      sortDirection,
      setAchievements,
      setPagination,
      setError,
      setLoading
    );
  }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection]);

  if (loading) {
    return <div className="text-center">Ładowanie osiągnięć...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container d-flex flex-column" style={{ minHeight: "90vh" }}>
      <div className="flex-grow-1">
        <h2 style={{ color: "white", marginBottom: "5%", marginTop: "3%" }}>
          Wszystkie osiągnięcia:
        </h2>

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
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

export default AllAchievements;
