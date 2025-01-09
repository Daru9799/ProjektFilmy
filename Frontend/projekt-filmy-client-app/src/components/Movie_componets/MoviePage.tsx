import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Movie } from '../../models/Movie';
import { Actor } from '../../models/Actor';
import { Review } from '../../models/Review';
import { useNavigate, useParams } from "react-router-dom";
import { renderStars } from "../../functions/starFunction";
import ReviewCard from "../review_components/ReviewCard";
import ImageModal from "../../functions/ImageModal";
import AddReviewModal from "../review_components/AddReviewPanel";

const MoviePage = () => {
  // const movieId = "d3a43d4f-9668-42d2-85c0-9e786befb0af"; 
    const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [isReviewAdded, setIsReviewAdded] = useState<boolean>(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieById = async () => {
      try {
        // Fetch movie and actors data
        const [movieResponse, actorsResponse] = await Promise.all([
          axios.get(`https://localhost:7053/api/Movies/${movieId}`),
          axios.get(`https://localhost:7053/api/Actors/by-movie-id/${movieId}`),
        ]);
  
        setMovie(movieResponse.data);
  
    
        try {
          setActors(actorsResponse.data.$values);
        } catch (actorsError) {
          if (axios.isAxiosError(actorsError) && actorsError.response?.status === 404) {
            setActors([]); 
            console.log("No actors found for this movie.");
          } else {
            setError("Error fetching actors.");
            console.error(actorsError);
          }
        }
  
        try {
          const reviewsResponse = await axios.get(
            `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`,
            {
              params: {
                pageNumber: 1,
                pageSize: 2, 
              },
            }
          );
          if (reviewsResponse.status === 200) {
            const reviewsData = reviewsResponse.data.data.$values;
            setReviews(reviewsData); 
          }
        } catch (reviewsError) {
          if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
            setReviews([]); 
            console.log("No reviews found for this movie.");
          } else {
            setError("Error fetching reviews.");
            console.error(reviewsError);
          }
        }
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError("Network error: Unable to connect to the server.");
          } else {
            setError(`Error: ${err.response.status} - ${err.response.statusText}`);
          }
        } else {
          setError("An unexpected error occurred.");
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



  const handleAddReview = () => {
 
    console.log("Dodano recenzję:", { review: newReview, rating: newRating });
    setShowReviewModal(false);
    setNewReview("");
    setNewRating(0);
    setIsReviewAdded(true);   //do zmiany potem!!!!
  };
  
  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vh-100 container-fluid text-white" style={{ left: "200px", marginBottom: "240px" }}>
  <div className="row my-4">
    {/* Left Column (Poster) */}
    <div className="col-3">
      <div className="p-2 text-center">
        <ImageModal
          imageUrl={movie?.posterUrl}
          altText="Poster"
          defaultImageUrl="/path/to/defaultPoster.jpg"
        />
      </div>
    </div>

    {/* Right Column (Details + Reviews) */}
    <div className="col-9">
      <div className="d-flex justify-content-between">
        {/* Film Details */}
        <div style={{ textAlign: "left", flex: "1" }}>
          {/* Title */}
          <h2 className="mb-3" style={{ fontSize: "4rem" }}>
            {movie?.title || "Tytuł niedostępny"}
          </h2>

{/* Directors */}
<p style={{ marginTop: "50px" }}>
      <span className="fw-bold">
        {(movie?.directors?.$values?.length ??0) >= 1 ? "Reżyser" : "Reżyserzy"}:
      </span>{" "}
      {movie?.directors?.$values?.length
        ? movie.directors.$values.map((d, index) => (
            <React.Fragment key={d.directorId}>
              <span
                onClick={() => navigate(`/director/${d.directorId}`)}
                style={{
                  cursor: "pointer",
                }}
              >
                {`${d.firstName} ${d.lastName}`}
              </span>
              {/* {index < movie.directors.$values.length - 1 && ", "} */}
            </React.Fragment>
          ))
        : "Brak danych o reżyserach"}
    </p>

          {/* Release Date */}
          <p>
            <span className="fw-bold">Data premiery: </span>
            {movie?.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Brak danych"}
          </p>

          {/* Duration */}
          <p>
            <span className="fw-bold">Czas trwania: </span>
            {movie?.duration ? `${movie.duration} min` : "Brak danych"}
          </p>
        </div>

{/* Reviews Section */}
<div
  className="d-flex flex-column align-items-center"
  style={{
    textAlign: "center",
    minWidth: "200px",
    marginLeft: "20px",
  }}
>
  {movie?.reviewsNumber && movie.reviewsNumber > 0 ? (
    <>
      {/* Stars */}
      <div>{renderStars(movie?.averageScore || 0)}</div>
      <h4 style={{ fontSize: "1.6rem" }}>
        {Number(movie?.averageScore).toFixed(1)}/5
      </h4>
      <p className="mb-0">Ilość ocen: {movie.reviewsNumber}</p>
    </>
  ) : (
    <p>Brak ocen</p>
  )}

  {/* Add Review Button */}
  {!isReviewAdded && (
        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowReviewModal(true)}
        >
          Dodaj recenzję
        </button>
      )}

  {/* Add Review Modal */}
  <AddReviewModal
    show={showReviewModal}
    onClose={() => setShowReviewModal(false)}
    onAddReview={handleAddReview}
  />
</div>
</div>

      {/* Navigation Tabs */}
      <ul
        className="nav nav-pills"
        style={{ marginBottom: "10px", marginTop: "30px", marginLeft:"20px" }}
      >
        <li className="nav-item">
          <button
            className="nav-link active"
            id="opis-tab"
            data-bs-toggle="pill"
            data-bs-target="#opis"
            type="button"
          >
            Opis
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            id="gatunki-tab"
            data-bs-toggle="pill"
            data-bs-target="#gatunki"
            type="button"
          >
            Gatunki
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            id="aktorzy-tab"
            data-bs-toggle="pill"
            data-bs-target="#aktorzy"
            type="button"
          >
            Aktorzy
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link"
            id="kraje-tab"
            data-bs-toggle="pill"
            data-bs-target="#kraje"
            type="button"
          >
            Kraje
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div
        className="bg-white p-3 shadow-sm"
        style={{
          fontSize: "1.1rem",
          minHeight: "140px",
          borderRadius: "20px",
          textAlign: "left",
          marginTop: "-10px",
          width:"80%"
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
                  <div
                    key={cat.name}
                    className="badge me-2 mb-2"
                    style={{
                      backgroundColor: "#A294F9",
                      minWidth: "60px",
                      minHeight: "40px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "5px",
                      color: "white",
                    }}
                  >
                    {cat.name}
                  </div>
                ))
              ) : (
                <p className="text-dark">Brak danych o gatunkach.</p>
              )}
            </div>
          </div>



{/* aktorzy */}
    <div className="tab-pane fade" id="aktorzy">
  <div className="d-flex flex-wrap gap-2">
    {actors.length > 0 ? (
      actors.map((actor) => (
        <button
          key={actor.actorId}
          className="list-button"
          onClick={() => navigate(`/actor/${actor.actorId}`)}
        >
          {actor.firstName} {actor.lastName}
        </button>
      ))
    ) : (
      <p>Brak danych o aktorach</p>
    )}
  </div>
</div>



          {/* Kraje */}
          <div className="tab-pane fade" id="kraje">
            <div className="d-flex flex-wrap">
              {movie?.countries?.$values?.length ? (
                movie.countries.$values.map((country) => (
                  <div
                    key={country.name}
                    className="badge me-2 mb-2"
                    style={{
                      backgroundColor: "#A294F9",
                      minWidth: "60px",
                      minHeight: "40px",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "5px",
                      color: "white",
                    }}
                  >
                    {country.name}
                  </div>
                ))
              ) : (
                <p>Brak danych o krajach</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Review Section */}
<div
  className="container pt-3 text-center"
  style={{ marginTop: "40px", marginBottom: "40px" }}
>
  <h3>Recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => <ReviewCard key={review.reviewId} review={review} />)
  ) : (
    <p>Brak recenzji dla tego filmu.</p>
  )}

  {/* Only show review count and "..." button if there are more than 2 reviews */}
  {(movie?.reviewsNumber ?? 0) > 2  && (
    <button
      className="edit-btn"
      onClick={handleReviewsClick}
      style={{
        fontSize: "20px", 
        color: "white", 
        backgroundColor: "transparent", 
        border: "none", 
        borderRadius: "50%", 
        cursor: "pointer", 
        transition: "all 0.3s ease", 
      }}
      onMouseOver={(e) => {
        (e.target as HTMLButtonElement).style.backgroundColor = "#6C48C5"; 
        (e.target as HTMLButtonElement).style.color = "white"; 
      }}
      onMouseOut={(e) => {
        (e.target as HTMLButtonElement).style.backgroundColor = "transparent"; 
        (e.target as HTMLButtonElement).style.color = "white"; 
      }}
    >
      ...
    </button>
  )}
</div>
</div>
  );
};

export default MoviePage;
