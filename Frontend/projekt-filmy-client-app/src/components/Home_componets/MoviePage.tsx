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
  const movieId = "a39e7ecc-12ac-4d2b-bc0b-6b12148aff1f";
  // const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
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

  const handleAddReview = () => {
    console.log("Dodano recenzję:", { review: newReview, rating: newRating });
    setShowReviewModal(false);
    setNewReview("");
    setNewRating(0);
  };
  
  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vh-100 container-fluid text-white" style={{ left: "200px", marginBottom:"100px" }}>
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
              marginTop: "10%",
              marginLeft: "10%",
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
                        backgroundColor: "#A294F9",
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
            backgroundColor: "#A294F9",
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
                        backgroundColor: "#A294F9",
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
<div
  className="col-3 d-flex align-items-center justify-content-end"
  style={{
    textAlign: "right",
    position: "absolute",
    right: "15%",
    top: "15%", // Zapewnia, że ocena pozostaje obok zdjęcia
  }}
>
  {movie?.reviewsNumber && movie.reviewsNumber > 0 && (
    <div
      className="p-3"
      style={{
        textAlign: "center",
      }}
    >
      {/* Renderowanie gwiazdek */}
      <div>{renderStars(movie?.averageScore || 0)}</div>
      <h4 style={{ fontSize: "1.6rem" }}>{Number(movie?.averageScore).toFixed(1)}/5</h4>
      <p className="mb-0">{movie.reviewsNumber}</p>
    </div>
  )}
</div>
{/* Przycisk do dodania recenzji */}
<div className="pt-3" style={{ marginTop: "20px" }}>
  <button
    className="btn btn-primary "
    style={{

    }}
    onClick={() => setShowReviewModal(true)}
  >
    Dodaj recenzję
  </button>
</div>

{/* Modal do dodawania recenzji */}
<Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Dodaj recenzję</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="mb-3">
      <label htmlFor="reviewText" className="form-label">
        Twoja recenzja:
      </label>
      <textarea
        id="reviewText"
        className="form-control"
        rows={4}
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Napisz swoją recenzję tutaj..."
      />
    </div>
    <div className="mb-3">
      <label htmlFor="reviewRating" className="form-label">
        Ocena (0-5):
      </label>
      <input
        type="number"
        id="reviewRating"
        className="form-control"
        step={0.1}
        min={0}
        max={5}
        value={newRating}
        onFocus={() => {
          if (newRating === 0) {
            setNewRating(0,);  
          }
        }}
        onKeyDown={(e) => {
          // Zezwól na strzałki w górę i w dół
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            return; // Pozwól na te klawisze
          }
          e.preventDefault();
        }}
        onChange={(e) => {
          // Walidacja, aby nie dopuścić wartości poza zakresem 0-5
          let value = parseFloat(e.target.value);
          if (value >= 0 && value <= 5) {
            setNewRating(value);
          }
        }}
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={() => setShowReviewModal(false)}>
      Anuluj
    </button>
    <button className="btn btn-primary" onClick={handleAddReview}>
      Zapisz
    </button>
  </Modal.Footer>
</Modal>

{/* Sekcja recenzji */}
<div className="pt-3">
  <h3>Recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <div
        key={review.reviewId} 
        className="d-flex justify-content-between align-items-start p-3 my-2 mx-auto"
        style={{
          backgroundColor: "white",
          borderRadius: "15px",  // Zaokrąglenie krawędzi
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Delikatny cień
          padding: "20px",
          color: "black",
          width: "95%",
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ fontWeight: "bold" }}>{review.username}</p>
          <p>{review.comment}</p>
        </div>
        <div style={{ textAlign: "right", color: "black" }}>
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
      (e.target as HTMLButtonElement).style.backgroundColor = "#6C48C5"; // Kolor tła po najechaniu
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
