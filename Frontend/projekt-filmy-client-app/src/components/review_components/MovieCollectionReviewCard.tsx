import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../SharedModals/ConfirmationModal";
import { renderStars } from "../../hooks/RenderStars";
import "../../styles/ReviewCard.css";
import { MovieCollectionReview } from "../../models/MovieCollectionReview";

interface MovieCollectionReviewCardProps {
  movieCollectionReview: MovieCollectionReview;
  userPage?: boolean;
  userRevieForMovie?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  isLoggedUserMod?: boolean;
  commentCount?: number; // Dodaj nową prop dla liczby komentarzy
  displayCommentCount?: boolean;
  onNavigateToComments?: () => void; // Dodaj nową prop dla nawigacji do komentarzy
}

const MovieCollectionReviewCard: React.FC<MovieCollectionReviewCardProps> = ({
  movieCollectionReview,
  userPage,
  userRevieForMovie,
  onDelete,
  onEdit,
  isLoggedUserMod,
  commentCount = 0, // Domyślna wartość 0
  displayCommentCount = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const navigate = useNavigate();

  const onNavigateToComments = () => {
    navigate(`/${movieCollectionReview.movieCollectionReviewId}/replies`);
  };

  return (
    <div
      className="d-flex justify-content-between align-items-start p-3 my-2 review-card"
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
          {/*
          userPage && (
            <Link
              to={`/${movieCollectionReview.movieCollectionReviewId}`}
              style={{
                fontWeight: "bold",
                fontStyle: "italic",
                textAlign: "center",
                flex: 1,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Kolekcja {movieCollectionReview.movieCollection.title}
            </Link>
          )*/}
        </div>

        {/* Comment */}
        <p>{movieCollectionReview.comment}</p>

        {/* Przyciski akcji i komentarze */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {(movieCollectionReview.isOwner || isLoggedUserMod) &&
            (userPage || userRevieForMovie) && (
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
          {/* Przycisk komentarzy */}
          {displayCommentCount && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Rating i Data */}
      <div style={{ textAlign: "right", color: "black" }}>
        {renderStars(movieCollectionReview.rating)}
        <h4>{movieCollectionReview.rating}/5</h4>
        <small>
          {movieCollectionReview?.date
            ? new Date(movieCollectionReview.date).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Brak danych"}
        </small>
      </div>

      {/* Potwierdzenie */}
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
  );
};

export default MovieCollectionReviewCard;
