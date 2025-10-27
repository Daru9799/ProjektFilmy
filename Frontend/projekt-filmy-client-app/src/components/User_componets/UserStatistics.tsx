import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStatistics } from "../../API/UserApi";
import "../../styles/UserPage.css";
import AccordionChart from "./AccordionChart";
import { Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger } from "react-bootstrap";
import SpinnerLoader from "../SpinnerLoader";
import ApiErrorDisplay from "../ApiErrorDisplay";

const UserStatistics = () => {
  const { userName } = useParams();
  const loggedUserName = localStorage.getItem("logged_username");
  const navigate = useNavigate();
      const renderTooltip = (props: any) => (
    <Tooltip {...props}>Powrót do profilu</Tooltip>
  );

  const { data: userStats, isLoading: statsLoading, apiError: statsError } = useUserStatistics(userName);

  if(statsLoading) return <SpinnerLoader />
  if(statsError) return <ApiErrorDisplay apiError={statsError} />
  if (!userStats) return <p>Brak danych.</p>;

  return (
  <div className="container text-white my-4" style={{ minHeight: "90vh" }}>
    <div className="d-flex align-items-center justify-content-between mb-4">
      <OverlayTrigger
        placement="top"
        overlay={renderTooltip}
      >
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/user/${userName}`)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      </OverlayTrigger>

      <h2 className="mb-0 mx-auto text-center">
        {loggedUserName === userName
          ? "Twoje statystyki:"
          : <>Statystyki użytkownika <strong>{userName}</strong></>}
      </h2>

      {/* Niewidoczny element do zbalansowania przestrzeni po prawej */}
      <div style={{ width: "40px" }} />
    </div>

      {/* Górne 4 karty */}
      <div className="row text-center g-4 mb-5" style={{ marginTop: "5%" }}>
        <div className="col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <i style={{marginTop:"10%"}} className="fas fa-clock fa-5x mb-2"></i>
              <p style={{marginTop:"15%"}}>Godzin oglądania: {userStats.hoursOfWathcedMovies} </p>
              <p>Obejrzanych filmów: {userStats.numberOfWathcedMovies}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <i style={{marginTop:"10%"}} className="fas fa-calendar-check fa-5x mb-2"></i>
              <p style={{marginTop:"20%"}}>Filmy zaplanowane: {userStats.numberOfPlannedMovies}</p>
            </div>
          </div>
        </div>

<div className="col-md-3">
  <div className="card bg-dark text-white h-100">
    <div className="card-body text-center">
      {userStats.favoriteActor ? (
        <Link to={`/people/${userStats.favoriteActor.personId}`} style={{ textDecoration: "none", color: "inherit" }}>
          <img
            src={userStats.favoriteActor.photoUrl}
            alt="Ulubiony aktor"
            className="mb-2"
            style={{ width: "120px", height: "170px", objectFit: "cover", borderRadius: "10%" }}
          />
          <h6 className="mt-2">
            {userStats.favoriteActor.firstName} {userStats.favoriteActor.lastName}
          </h6>
          <p style={{ marginTop: "15%" }}>Ulubiony aktor</p>
        </Link>
      ) : (
        <p className="mt-5">Brak danych o ulubionym aktorze</p>
      )}
    </div>
  </div>
</div>


        <div className="col-md-3">
  <div className="card bg-dark text-white h-100">
    <div className="card-body text-center">
      {userStats.favoriteDirector ? ( // link potencjalnie do zmiany
        <Link to={`/people/${userStats.favoriteDirector.personId}`} style={{ textDecoration: "none", color: "inherit" }}>
          <img
            src={userStats.favoriteDirector.photoUrl}
            alt="Ulubiony reżyser"
            className="mb-2"
            style={{ width: "120px", height: "170px", objectFit: "cover", borderRadius: "10%" }}
          />
          <h6 className="mt-2">
            {userStats.favoriteDirector.firstName} {userStats.favoriteDirector.lastName}
          </h6>
          <p style={{ marginTop: "15%" }}>Ulubiony reżyser</p>
        </Link>
      ) : (
        <p className="mt-5">Brak danych o ulubionym reżyserze</p>
      )}
    </div>
  </div>
</div>

      </div>

{/* // Accordion sekcja z wykresami */}
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
    data={userStats.watchedMoviesByCategory.$values.map(item => ({
      category: item.category.name, 
      count: item.count
    }))}
    xKey="count"
    yKey="category"
    xLabel="Liczba filmów"
    yLabel="Kategoria"
    barColor="#ffc658"
  />

  <AccordionChart
    title="Filmy według państw"
    data={userStats.watchedMoviesByCountry.$values.map(item => ({
      country: item.country.name,
      count: item.count
    }))}
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
