import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../SharedModals/ConfirmationModal";
import { renderStars } from "../../hooks/RenderStars";
import "../../styles/ReviewCard.css";
import { MovieCollectionReview } from "../../models/MovieCollectionReview";
import { MovieCollection } from "../../models/MovieCollection";

interface MovieCollectionReviewCardProps {
  movieCollectionReview: MovieCollectionReview;
  movieCollection?: MovieCollection | null;
  userPage?: boolean;
  userReviewForCollection?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  isLoggedUserMod?: boolean;
  commentCount?: number;
  displayCommentCount?: boolean;
  onNavigateToComments?: () => void;
}

const MovieCollectionReviewCard: React.FC<MovieCollectionReviewCardProps> = ({
  movieCollectionReview,
  movieCollection,
  userPage,
  userReviewForCollection,
  onDelete,
  onEdit,
  isLoggedUserMod,
  commentCount = 0,
  displayCommentCount = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => setShowModal(true);
  const handleConfirmDelete = () => {
    onDelete?.();
    setShowModal(false);
  };
  const handleCancelDelete = () => setShowModal(false);

  const onNavigateToComments = () => {
    navigate(
      `/movie-collection/${movieCollectionReview.movieCollectionReviewId}/replies`
    );
  };

  return (
    <>
      {/* --- LARGE SCREEN LAYOUT --- */}
      <div
        className="d-none d-md-flex justify-content-between align-items-start p-3 my-2 review-card"
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          color: "black",
          backgroundColor: movieCollectionReview.isCritic ? "#CDC1FF" : "white",
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          {/* Username */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p style={{ fontWeight: "bold", margin: 0 }}>
              {movieCollectionReview.isCritic && (
                <span className="critic-badge">
                  ✔️
                  <span className="tooltip">Krytyk filmowy</span>
                </span>
              )}
              <Link
                to={`/user/${movieCollectionReview.username}`}
                style={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {movieCollectionReview.username}
              </Link>
            </p>

            {userPage && (
              <Link
                to={`/user/${movieCollection?.userName}/movieCollection/${movieCollectionReview.movieCollectionId}`}
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  textAlign: "center",
                  flex: 1,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                Kolekcja {movieCollection?.title}
              </Link>
            )}
          </div>

          {/* Comment */}
          <p>{movieCollectionReview.comment}</p>

          {/* Buttons + comments */}
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            {(movieCollectionReview.isOwner || isLoggedUserMod) &&
              (userPage || userReviewForCollection) && (
                <>
                  <button
                    className="btn btn-secondary"
                    style={{
                      background: "none",
                      border: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={onEdit}
                    aria-label="Edytuj recenzję"
                  >
                    <i className="fas fa-edit zoomIcons"></i>
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    style={{
                      background: "none",
                      border: "none",
                      color: "black",
                      cursor: "pointer",
                    }}
                    onClick={handleDeleteClick}
                    aria-label="Usuń recenzję"
                  >
                    <i className="fas fa-trash zoomIcons"></i>
                  </button>
                </>
              )}

            {displayCommentCount && (
              <button
                onClick={onNavigateToComments}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6c757d",
                  marginRight: "auto",
                }}
                aria-label="Przejdź do komentarzy"
              >
                <i className="far fa-comment"></i>
                <span>{commentCount}</span>
              </button>
            )}
          </div>
        </div>

        {/* Rating and Date */}
        <div style={{ textAlign: "right", color: "black" }}>
          {renderStars(movieCollectionReview.rating)}
          <h4>{movieCollectionReview.rating}/5</h4>
          <small>
            {movieCollectionReview?.date
              ? new Date(movieCollectionReview.date).toLocaleDateString(
                  "pl-PL",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              : "Brak danych"}
          </small>
        </div>
      </div>

      {/* --- SMALL SCREEN LAYOUT --- */}
      <div
        className="d-flex d-md-none flex-column align-items-center p-3 my-2 review-card"
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: movieCollectionReview.isCritic ? "#CDC1FF" : "white",
          color: "black",
          textAlign: "center",
        }}
      >
        {/* Username */}
        <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
          {movieCollectionReview.isCritic && (
            <span className="critic-badge">
              ✔️
              <span className="tooltip">Krytyk filmowy</span>
            </span>
          )}
          <Link
            to={`/user/${movieCollectionReview.username}`}
            style={{ fontWeight: "bold", textDecoration: "none", color: "inherit" }}
          >
            {movieCollectionReview.username}
          </Link>
        </p>

        {/* Collection link (if userPage) */}
        {userPage && (
          <Link
            to={`/user/${movieCollection?.userName}/movieCollection/${movieCollectionReview.movieCollectionId}`}
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              textDecoration: "none",
              color: "inherit",
              marginBottom: "10px",
            }}
          >
            Kolekcja {movieCollection?.title}
          </Link>
        )}

        {/* Comment */}
        <p>{movieCollectionReview.comment}</p>

        {/* Buttons + comment count */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {(movieCollectionReview.isOwner || isLoggedUserMod) &&
            (userPage || userReviewForCollection) && (
              <>
                <button
                  onClick={onEdit}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <i className="fas fa-edit zoomIcons"></i>
                </button>
                <button
                  onClick={handleDeleteClick}
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <i className="fas fa-trash zoomIcons"></i>
                </button>
              </>
            )}
          {displayCommentCount && (
            <button
              onClick={onNavigateToComments}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              <i className="far fa-comment"></i>
              <span>{commentCount}</span>
            </button>
          )}
        </div>

        {/* Rating */}
        <div style={{ marginBottom: "5px" }}>{renderStars(movieCollectionReview.rating)}</div>
        <h4 style={{ marginTop: 0, marginBottom: "5px" }}>
          {movieCollectionReview.rating}/5
        </h4>

        {/* Date */}
        <small style={{ marginBottom: "5px" }}>
          {movieCollectionReview?.date
            ? new Date(movieCollectionReview.date).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Brak danych"}
        </small>

        <ConfirmationModal
          show={showModal}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Potwierdzenie usunięcia"
          message="Czy na pewno chcesz usunąć tę recenzję?"
          confirmButtonText="Usuń"
          confirmButtonVariant="danger"
        />
      </div>
    </>
  );
};

export default MovieCollectionReviewCard;
