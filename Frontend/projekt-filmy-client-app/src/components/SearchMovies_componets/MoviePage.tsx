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
import { fetchMovieData, fetchActorsData, fetchMovieReviews, fetchUserReviewForMovie, editReview, deleteReview } from "../../functions/ReloadFunctions";

const MoviePage = () => {
  const { movieId } = useParams();
  const userName = localStorage.getItem("logged_username") || "";
  const [movie, setMovie] = useState<Movie | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const navigate = useNavigate();

  // Using the imported functions
  useEffect(() => {
    if (movieId) {
      fetchMovieData(movieId, setMovie, setError);
      fetchActorsData(movieId, setActors, setError);
      fetchMovieReviews(movieId, setReviews, setError, setLoading);
      fetchUserReviewForMovie(userName,movieId,setUserReview,setError)

    } else {
      setError("Nieoczekiwany błąd");
    }
  }, [movieId]);
  
  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };


  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId, setReviews);
      setUserReview(null);
  
      // Odśwież dane z serwera
      if (movieId) {
        await fetchMovieReviews(movieId, setReviews, setError, setLoading);
        await fetchMovieData(movieId, setMovie, setError);
      }
    } catch (err) {
      console.error("Błąd podczas usuwania recenzji:", err);
    }
  };
  

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      try {
        await editReview(
          reviewToEdit.reviewId,
          { comment: reviewText, rating },
          setReviews,
          setError
        );
        if (movieId) {
          fetchMovieReviews(movieId, setReviews, setError, setLoading);
          fetchMovieData(movieId, setMovie, setError);
          fetchUserReviewForMovie(userName, movieId, setUserReview, setError); // tu odświeża od razu
        }
      } catch (err) {
        console.error("Błąd podczas edycji recenzji:", err);
        setError("Nie udało się edytować recenzji.");
      } finally {
        setShowEditModal(false);
        setReviewToEdit(null);
      }
    }
  };
  

  const handleAddReview = async (review: string, rating: number) => {
    try {
      const newReviewData = {
        Rating: rating,
        Comment: review,
        Date: new Date().toISOString(),
        MovieId: movieId,
        UserName: userName,
      };

      const response = await axios.post(
        "https://localhost:7053/api/Reviews/add-review",
        newReviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        if(movieId){
        fetchMovieReviews(movieId, setReviews, setError, setLoading);
        fetchMovieData(movieId, setMovie, setError);
        fetchUserReviewForMovie(userName,movieId,setUserReview,setError);
        setShowReviewModal(false);
        }
        else 
          setError("Nieoczekiwany błąd")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Błąd 500:', error.response?.data);  // To wyświetli szczegóły błędu, jeśli są dostępne
      } else {
        console.error('Błąd:', error);
      }
      setError("Błąd podczas dodawania recenzji");
      console.error(error);
    }
  };
  const isLoggedIn = !!localStorage.getItem("token");
  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid text-white" style={{ left: "200px", minHeight:"90vh"}}>
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

{/* średnia ocen */}
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
      <div>{renderStars(movie?.averageScore || 0)}</div>
      <h4 style={{ fontSize: "1.6rem" }}>
        {Number(movie?.averageScore).toFixed(1)}/5
      </h4>
      <p className="mb-0">Ilość ocen: {movie.reviewsNumber}</p>
    </>
  ) : (
    <p>Brak ocen</p>
  )}

  {/* Dodaj */}
  {!userReview ? (
  localStorage.getItem("token") ? (
    <button
      className="btn btn-primary mt-3"
      onClick={() => setShowReviewModal(true)}
    >
      Dodaj recenzję
    </button>
  ) : (
    <p>Aby dodać recenzję musisz być zalogowany</p>
  )
) : (
  <p></p>
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
          height: "140px",
          overflow:"auto",
          paddingRight:"10px",
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
        <button
          key={cat.name}
          className="list-button"
          onClick={() => {}}
        >
          {cat.name}
        </button>
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
        <button
          key={country.name}
          className="list-button" 
          onClick={() => {}}
        >
          {country.name}
        </button>
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


  {userReview ? (
  <div>
    <h3>Twoja recenzja:</h3>
    <ReviewCard
      key={userReview.reviewId}
      review={userReview}
      userRevieForMovie={true}
      onEdit={() => handleEditReview(userReview)} 
      onDelete={() => handleDeleteReview(userReview.reviewId)}
    />
  </div>
) : (
  <p></p>
)}

{/* Modal edycji */}
{reviewToEdit && (
  <AddReviewModal
    show={showEditModal}
    onClose={() => setShowEditModal(false)}
    onAddReview={handleSaveEditedReview}
    initialReviewText={reviewToEdit.comment}
    initialReviewRating={reviewToEdit.rating}
  />
)}


  {/* Recenzje */}
<div
  className="container pt-3 text-center"
  style={{ marginTop: "10px", marginBottom: "40px" }}
>
  <h3>Recenzje:</h3>
  {reviews.length > 0 ? (
    reviews.map((review) => <ReviewCard key={review.reviewId} review={review} />)
  ) : (
    <p>Brak recenzji dla tego filmu.</p>
  )}

{/* Więcej recenzji */}
  {(movie?.reviewsNumber ?? 0) > 2 && (
  <button
    className="review-btn"
    onClick={()=>navigate(`/${movieId}/reviews`)}
  >
    ...
  </button>
)}

</div>
</div>
  );
};

export default MoviePage;
