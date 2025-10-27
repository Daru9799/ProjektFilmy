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
  handleChangeFollowing: () => void;
  userReview: Review | null;
  isFollowing: boolean;
  inList: string | null;
  handleChangeWatched: () => void;
  handleChangePlanned: () => void;
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
  handleChangeFollowing,
  userReview,
  isFollowing,
  inList,
  handleChangeWatched,
  handleChangePlanned,
}) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column flex-md-row w-100">
      {/* Lewa sekcja */}
      <div className="flex-fill text-start mb-3 mb-md-0">
        <h2 className="mb-3" style={{ fontSize: "2rem", fontWeight: "bold" }}>
          {movie?.title || "Tytuł niedostępny"}
        </h2>

        <p>
          <span className="fw-bold">
            {(movie?.directors?.$values?.length ?? 0) > 1 ? "Reżyserzy" : "Reżyser"}:
          </span>{" "}
          {movie?.directors?.$values?.length
            ? movie.directors.$values.map((d, index) => (
                <React.Fragment key={d.personId}>
                  <span
                    onClick={() => navigate(`/people/${d.personId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${d.firstName} ${d.lastName}`}
                  </span>
                  {index < (movie.directors?.$values?.length ?? 0) - 1 ? ", " : ""}
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

      {/* Prawa sekcja */}
      <div className="d-flex flex-column align-items-center text-center" style={{ minWidth: "200px" }}>
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
          isFollowing={isFollowing}
          handleChangeFollowing={handleChangeFollowing}
          inList={inList}
          handleChangePlanned={handleChangePlanned}
          handleChangeWatched={handleChangeWatched}
        />
      </div>
    </div>
  );
};


export default MovieHeader;
