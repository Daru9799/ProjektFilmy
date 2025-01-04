import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Movie } from '../../models/Movie';
import { Actor } from '../../models/Actor';
import { useNavigate, useParams } from "react-router-dom";

const MoviePage = () => {
  const movieId="6b27aed7-2b95-40ff-8bfa-98c4931b235e";
  // const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieById = async () => {
      try {
        const response = await axios.get(`https://localhost:7053/api/Movies/${movieId}`);
        setMovie(response.data);
        const response2 = await axios.get(`https://localhost:7053/api/Actors/by-movie-id/${movieId}`)
        setActors(response2.data.$values);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError("Błąd sieci: nie można połączyć się z serwerem.");
          } else {
            setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
          }
        } else {
          setError("Wystąpił nieoczekiwany błąd.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieById();
  }, [movieId]);

  const handleReviewsClick = () => {
    navigate(`/reviews/${movieId}`); 
  };

  return (
    <div className="vh-100 container-fluid text-white" style={{left:'200px'}}>
      <div className="row my-4">
        {/* Left Column (Poster) */}


      <div className="col-3"> {/* Zmieniłem col-2 na col-3, aby dać więcej przestrzeni */}
        <div className="p-2 text-center">
          <img
            src={movie?.posterUrl || "/path/to/defaultPoster.jpg"}
            alt="Poster"
            className="img-fluid"
            style={{ width: "100%", height: "auto", objectFit: "cover" }}  
          />
        </div>
      </div>

        {/* Middle Column (Details) */}
        <div className="col-7" style={{textAlign:"left"}}>
          {/* Title */}
          <h2 className="mb-3" style={{fontSize:"4rem"}}>{movie?.title || "Tytuł niedostępny"}</h2>

          {/* Reżyserzy */}
          <p>
            <span className="fw-bold" >{movie?.directors?.$values.length === 1 ? "Reżyser" : "Reżyserzy"}:</span>{" "}
            {movie?.directors?.$values?.length
              ? movie.directors.$values.map((d) => `${d.firstName} ${d.lastName}`).join(", ")
              : "Brak danych o reżyserach"}
          </p>

          {/* Data premiery */}
          <p>
            <span className="fw-bold" >Data premiery: </span> 
            {movie?.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) : "Brak danych"}
          </p>

          {/* Czas trwania */}
          <p>
            <span className="fw-bold">Czas trwania: </span> 
            {movie?.duration ? `${movie.duration} min` : "Brak danych"}
          </p>

          {/* Navigation Tabs */}
          <ul className="nav nav-pills my-3">
            <li className="nav-item">
              <button className="nav-link active" id="opis-tab" data-bs-toggle="pill" data-bs-target="#opis" type="button">
                Opis
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" id="gatunki-tab" data-bs-toggle="pill" data-bs-target="#gatunki" type="button">
                Gatunki
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" id="aktorzy-tab" data-bs-toggle="pill" data-bs-target="#aktorzy" type="button">
                Aktorzy
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" id="kraje-tab" data-bs-toggle="pill" data-bs-target="#kraje" type="button">
                Kraje
              </button>
            </li>
          </ul>

          {/* Stały prostokąt */}
          <div className="bg-white p-3 shadow-sm" style={{fontSize:'1.1rem',
           minHeight:'200px',
           minWidth:'700px',
           borderRadius:"30px",
           textAlign:"left"}}>
  
            <div className="tab-content">
              {/* Opis */}
              <div className="tab-pane fade show active" id="opis">
                <p className="text-dark">{movie?.description || "Brak opisu filmu."}</p>
              </div>

              {/* Gatunki */}
              <div className="tab-pane fade" id="gatunki">
                <div className="d-flex flex-wrap">
                  {movie?.categories?.$values?.length ? (
                    movie.categories.$values.map((cat) => (
                      <div key={cat.name} className="badge  me-2 mb-2"
                      style={{
                        backgroundColor:"#2E5077",
                        minWidth:"60px",
                        minHeight:"40px",
                        textAlign:"center",
                      }}>
                        {cat.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-dark">Brak danych o gatunkach.</p>
                  )}
                </div>
              </div>

              {/* Aktorzy */}
              <div className="tab-pane fade" id="aktorzy">
                <div className="d-flex flex-wrap ">
                  {actors.length > 0 ? (
                  <ul>
                    {actors.map((actor) => (
                      <li key={actor.actorId} style={{ marginBottom: "20px" }}>
                        <div key={actor.actorId} className="badge  me-2 mb-2"
                            style={{
                              backgroundColor:"#2E5077",
                              minWidth:"60px",
                              minHeight:"40px",
                              textAlign:"center",
                            }}>
                              {actor.firstName} {actor.lastName}
                            </div>
                      </li>
                    ))}
                  </ul>
                )  : (
                  <p>Brak aktorów powiązanych z tym filmem.</p>
                )}
                </div>
              </div>
              {/* Kraje */}
              <div className="tab-pane fade" id="kraje">
                <div className="d-flex flex-wrap ">
                  {movie?.countries?.$values?.length ? (
                    movie.countries.$values.map((country) => (
                      <div key={country.name} className="badge  me-2 mb-2"
                      style={{
                        backgroundColor:"#2E5077",
                        minWidth:"60px",
                        minHeight:"40px",
                        textAlign:"center"
                      }}>
                        {country.name}
                      </div>
                    ))
                  ) : (
                    <p>Brak danych o krajach.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Ratings) */}
        <div className="col-2" style={{width:"20px", textAlign:"right"}}>
          <div className="text-center p-3">
            <h4>{movie?.averageScore}</h4>
            <p className="mb-0">{movie?.reviewsNumber}</p>
          </div>
        </div>
      </div>

 
    

<div className="pt-3">
  <h3>Recenzje:</h3>
  <div
    className="d-flex justify-content-between align-items-start p-3 my-2"
    style={{
      backgroundColor: "white",
      borderRadius: "15px",  // Zaokrąglenie krawędzi
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Delikatny cień
      padding: "20px",
      color:"black"
    }}
  >
    <div style={{ flex: 1,textAlign: "left"}}>
      <p style={{  fontWeight: "bold"}}>Jacek Ryba</p>
      <p>film nawet fajny, ale pies mi naszczał do buta więc 2/10</p>
    </div>
    <div style={{ textAlign: "center" , color:"black"}}>
      <h4 className="mb-0">2/10</h4>
      <small>20.12.2024</small>
    </div>
  </div>

  <button
    className="edit-btn"
    onClick={handleReviewsClick}
    style={{
      fontSize: "20px",     // Rozmiar tekstu
      color: "white",       // Kolor tekstu
      backgroundColor: "transparent", // Przezroczyste tło
      border: "none",   // Obramowanie
      borderRadius: "50%", // Okrogły kształt
      cursor: "pointer",   // Wskaźnik kursora
      transition: "all 0.3s ease", // Płynne przejście
    }}
    onMouseOver={(e) => {
      (e.target as HTMLButtonElement).style.backgroundColor = "#2E5077"; // Kolor tła po najechaniu
      (e.target as HTMLButtonElement).style.color = "white";  // Kolor tekstu po najechaniu
    }}
    onMouseOut={(e) => {
      (e.target as HTMLButtonElement).style.backgroundColor = "transparent"; // Powrót do przezroczystego tła
      (e.target as HTMLButtonElement).style.color = "white";  // Powrót koloru tekstu
    }}
  >
    ...
  </button>



</div>
</div>
  );
};

export default MoviePage;
