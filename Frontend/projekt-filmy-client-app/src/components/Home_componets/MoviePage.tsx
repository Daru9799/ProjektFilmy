import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import { Movie } from '../../models/Movie';
import { Actor } from '../../models/Actor';
import { Review } from '../../models/Review';
import { useNavigate, useParams } from "react-router-dom";
import { renderStars } from "../../functions/starFunction";


const MoviePage = () => {
  const movieId="eb607d9d-8733-4ad8-a385-f534ba77750b";
  // const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieById = async () => {
      try {
        const [movieResponse, reviewsResponse, actorsResponse] = await Promise.all([
          axios.get(`https://localhost:7053/api/Movies/${movieId}`),
          axios.get(`https://localhost:7053/api/Reviews/by-movie-id/${movieId}`, {
            //Argumenty do backendu dotyczące numeru strony i rozmiaru strony (potem trzeba to połączyć z panelem stron)
            params: {
              pageNumber: 1,
              pageSize: 2, //Biorę 2 recenzje z 1 strony
            },
          }),
          axios.get(`https://localhost:7053/api/Actors/by-movie-id/${movieId}`)
        ]);
        console.log(reviewsResponse.data);
        //Tutaj zapisywane są kolejno do zmiennych reviewsData czyli lista recenzji i parametry dotyczące paginacji do uzycia potem przy tworzeniu stron
        const { data, totalItems, pageNumber, pageSize, totalPages } = reviewsResponse.data; 

        setReviews(data.$values); //Tutaj trzeba te dane przekazać do mapowania na obiekt
        setMovie(movieResponse.data);
        setActors(actorsResponse.data.$values);
        
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

    const handleImageClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  
  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vh-100 container-fluid text-white" style={{ left: "200px" }}>
    <div className="row my-4">
      {/* Left Column (Poster) */}
      <div className="col-3">
        <div className="p-2 text-center">
          <img
            src={movie?.posterUrl || "/path/to/defaultPoster.jpg"}
            alt="Poster"
            className="img-fluid"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              marginTop: "20px",
              marginLeft: "20px",
              cursor: "pointer", // Cursor pointer for click indication
            }}
            onClick={handleImageClick}
          />
        </div>
      </div>


{/* Modal for enlarged image */}
<Modal show={showModal} onHide={closeModal} centered>
        <Modal.Body className="p-0">
          <img
            src={movie?.posterUrl || "/path/to/defaultPoster.jpg"}
            alt="Enlarged Poster"
            className="img-fluid"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
        <button className="btn btn-secondary" onClick={closeModal}>
            Zamknij
        </button>
        </Modal.Footer>
      </Modal>

        {/* Middle Column (Details) */}
        <div className="col-8" style={{textAlign:"left", marginLeft:"50px", marginTop:"20px"}}>
          {/* Title */}
          <h2 className="mb-3" style={{fontSize:"4rem"}}>{movie?.title || "Tytuł niedostępny"}</h2>

          {/* Reżyserzy */}
          <p>
            <span className="fw-bold">
            {movie?.directors?.$values.length === 1 ? "Reżyser" : "Reżyserzy"}:</span>{" "}
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
<ul className="nav nav-pills" 
style={{marginBottom:"10px", marginLeft:"20px", marginTop:"50px"}}> 
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

{/* Prostokąt z wyświetlanymi danymi */}
<div
  className="bg-white p-3 shadow-sm"
  style={{
    fontSize: "1.1rem",
    minHeight: "140px",
    borderRadius: "20px",
    textAlign: "left",
    marginTop: "-10px", // Dodanie ujemnego marginesu, aby zmniejszyć odstęp od guzików
    marginRight:"50px"
  }}
>
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
                        backgroundColor: "#2E5077",
                        minWidth: "60px",
                        minHeight: "40px",
                        textAlign: "center",
                        display: "flex", // Ustawia Flexbox
                        alignItems: "center", // Centrowanie w pionie
                        justifyContent: "center", // Centrowanie w poziomie
                        margin: "5px", // Odstęp między kafelkami
                        color: "white",
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
  <div className="d-flex flex-wrap gap-2"> {/* gap-2 dodaje odstępy między kafelkami */}
    {actors.length > 0 ? (
      actors.map((actor) => (
        <div
          key={actor.actorId}
          className="badge"
          style={{
            backgroundColor: "#2E5077",
            minWidth: "60px",
            minHeight: "40px",
            textAlign: "center",
            display: "flex", // Ustawia Flexbox
            alignItems: "center", // Centrowanie w pionie
            justifyContent: "center", // Centrowanie w poziomie
            margin: "5px", // Odstęp między kafelkami
            color: "white",
          }}
        >
          {actor.firstName} {actor.lastName}
        </div>
      ))
    ) : (
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
                        backgroundColor: "#2E5077",
                        minWidth: "60px",
                        minHeight: "40px",
                        textAlign: "center",
                        display: "flex", // Ustawia Flexbox
                        alignItems: "center", // Centrowanie w pionie
                        justifyContent: "center", // Centrowanie w poziomie
                        margin: "5px", // Odstęp między kafelkami
                        color: "white",
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
      <div className="col-3" style={{ width: "50px", textAlign: "right" }}>
  {movie?.reviewsNumber && movie.reviewsNumber > 0 && (
    <div
      className="p-3"
      style={{ textAlign: "center", marginLeft: "-100px", marginTop: "20px" }}
    >
      {/* Renderowanie gwiazdek */}
      <div>{renderStars(movie?.averageScore || 0)}</div>
      <h4 style={{ fontSize: "1.6rem" }}>{movie?.averageScore}/5</h4>
      <p className="mb-0">{movie.reviewsNumber}</p>
    </div>
  )}
</div>
      </div>

      <div className="pt-3">
  <h3>Recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <div
        key={review.reviewId} // Zakładamy, że każda recenzja ma unikalne reviewId
        className="d-flex justify-content-between align-items-start p-3 my-2"
        style={{
          backgroundColor: "white",
          borderRadius: "15px",  // Zaokrąglenie krawędzi
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Delikatny cień
          padding: "20px",
          color: "black",
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ fontWeight: "bold" }}>{review.username}</p>
          <p>{review.comment}</p>
        </div>
            <div style={{ textAlign: "center", color: "black" }}>
              {renderStars(review.rating)}
              <h4>{review.rating}/5</h4>
              <small>{review?.date ? new Date(review.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) : "Brak danych"}</small>
        </div>
      </div>
    ))
  ) : (
    <p>Brak recenzji dla tego filmu.</p>
  )}
</div>


{movie?.reviewsNumber && movie?.reviewsNumber >2  && (
  <button
    className="edit-btn"
    onClick={handleReviewsClick}
    style={{
      fontSize: "20px", // Rozmiar tekstu
      color: "white", // Kolor tekstu
      backgroundColor: "transparent", // Przezroczyste tło
      border: "none", // Obramowanie
      borderRadius: "50%", // Okrągły kształt
      cursor: "pointer", // Wskaźnik kursora
      transition: "all 0.3s ease", // Płynne przejście
    }}
    onMouseOver={(e) => {
      (e.target as HTMLButtonElement).style.backgroundColor = "#2E5077"; // Kolor tła po najechaniu
      (e.target as HTMLButtonElement).style.color = "white"; // Kolor tekstu po najechaniu
    }}
    onMouseOut={(e) => {
      (e.target as HTMLButtonElement).style.backgroundColor = "transparent"; // Powrót do przezroczystego tła
      (e.target as HTMLButtonElement).style.color = "white"; // Powrót koloru tekstu
    }}
  >
    ...
  </button>
)}
</div>
  );
};

export default MoviePage;
