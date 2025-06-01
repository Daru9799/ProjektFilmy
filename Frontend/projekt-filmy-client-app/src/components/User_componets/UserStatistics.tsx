import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserStatistics } from "../../API/userAPI";
import { UserStats } from "../../models/UserStats";
import "../../styles/UserPage.css";
import AccordionChart from "./AccordionChart";

const UserStatistics = () => {
  const { userName } = useParams();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userName) {
      fetchUserStatistics(userName, setUserStats, setError, setLoading);
    }
  }, [userName]);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (!userStats) return <p>Brak danych.</p>;

  return (
    <div className="container text-white my-4" style={{ minHeight: "90vh" }}>
      <h2 className="text-center mb-4">
        Statystyki użytkownika <strong>{userName}</strong>
      </h2>

      {/* Górne 4 karty */}
      <div className="row text-center g-4 mb-5" style={{ marginTop: "5%" }}>
        <div className="col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <i style={{marginTop:"10%"}} className="fas fa-clock fa-5x mb-2"></i>
              <p style={{marginTop:"10%"}}>Godzin oglądania: {userStats.hoursOfWathcedMovies} </p>
              <p>Obejrzanych filmów: {userStats.numberOfWathcedMovies}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <i style={{marginTop:"10%"}} className="fas fa-calendar-check fa-5x mb-2"></i>
              <p style={{marginTop:"15%"}}>Filmy zaplanowane: {userStats.numberOfPlannedMovies}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
            <img
                src={userStats.favoriteActor?.photoUrl}
                alt="Ulubiony reżyser"
                className="mb-2"
                style={{ width: "120px", height: "170px", objectFit: "cover", borderRadius:"10%" }}
            />
              
              <h6>
                {(userStats.favoriteActor?.firstName || "") +
                  " " +
                  (userStats.favoriteActor?.lastName || "") || "Brak"}
              </h6>
              <p style={{marginTop:"15%"}}>Ulubiony aktor</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
             <img
                src={userStats.favoriteDirector?.photoUrl}
                alt="Ulubiony reżyser"
                className="mb-2"
                style={{ width: "120px", height: "170px", objectFit: "cover", borderRadius:"10%" }}
            />
            
              <h6>
                {(userStats.favoriteDirector?.firstName || "") +
                  " " +
                  (userStats.favoriteDirector?.lastName || "") || "Brak"}
              </h6>
                <p style={{marginTop:"15%"}}>Ulubiony reżyser</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion sekcja z wykresami */}
      <div className="accordion" id="userStatsAccordion">
        <AccordionChart
          title="Rozkład ocen"
          data={userStats.ratingDistribution.$values}
          xKey="count"
          yKey="rating"
          xLabel="Liczba ocen"
          yLabel="Ocena"
          barColor="#8884d8"
        />

        <AccordionChart
          title="Filmy według kategorii"
          data={userStats.watchedMoviesByCategory.$values}
          xKey="count"
          yKey="category"
          xLabel="Liczba filmów"
          yLabel="Kategoria"
          barColor="#ffc658"
        />

        <AccordionChart
          title="Filmy według krajów"
          data={userStats.watchedMoviesByCountry.$values}
          xKey="count"
          yKey="country"
          xLabel="Liczba filmów"
          yLabel="Kraj"
          barColor="#82ca9d"
        />
      </div>
    </div>
  );
};

export default UserStatistics;
