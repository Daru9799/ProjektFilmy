import React from "react";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../models/Movie";
import { renderStars } from "../../hooks/RenderStars";
import ReviewActionsPanel from "./ReviewActionPanel";
import { Review } from "../../models/Review";

interface Props {
  movie: Movie | null;
  isLoggedIn: boolean;
  showReviewModal: boolean;
  showLoginModal: boolean;
  setShowReviewModal: (value: boolean) => void;
  setShowLoginModal: (value: boolean) => void;
  handleAddReview: (review: string, rating: number) => void;
  handleLoginSuccess: (username: string) => void;
  userReview: Review | null;
}

const MovieHeader: React.FC<Props> = ({
  movie,
  isLoggedIn,
  showReviewModal,
  showLoginModal,
  setShowReviewModal,
  setShowLoginModal,
  handleAddReview,
  handleLoginSuccess,
  userReview,
}) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between">
      {/* Lewa sekcja z informacjami o filmie */}
      <div style={{ textAlign: "left", flex: "1" }}>
        <h2 className="mb-3" style={{ fontSize: "4rem" }}>
          {movie?.title || "Tytuł niedostępny"}
        </h2>

        <p style={{ marginTop: "50px" }}>
          <span className="fw-bold">
            {(movie?.directors?.$values?.length ?? 0) >= 1
              ? "Reżyser"
              : "Reżyserzy"}
            :
          </span>{" "}
          {movie?.directors?.$values?.length
            ? movie.directors.$values.map((d, index) => (
                <React.Fragment key={d.directorId}>
                  <span
                    onClick={() => navigate(`/director/${d.directorId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${d.firstName} ${d.lastName}`}
                  </span>
                </React.Fragment>
              ))
            : "Brak danych o reżyserach"}
        </p>

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

        <p>
          <span className="fw-bold">Czas trwania: </span>
          {movie?.duration ? `${movie.duration} min` : "Brak danych"}
        </p>
      </div>

      {/* Prawa sekcja z oceną i przyciskiem */}
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
            <p className="mb-2">Ilość ocen: {movie.reviewsNumber}</p>
          </>
        ) : (
          <p>Brak ocen</p>
        )}

        {/* Przycisk "Dodaj recenzję" */}
        <ReviewActionsPanel
          isLoggedIn={isLoggedIn}
          showReviewModal={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          handleAddReview={handleAddReview}
          handleLoginSuccess={handleLoginSuccess}
          userReview={userReview}
        />
      </div>
    </div>
  );
};

export default MovieHeader;
