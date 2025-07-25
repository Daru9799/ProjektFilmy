import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../SharedModals/ConfirmationModal";
import { Review } from "../../models/Review";
import { renderStars } from "../../hooks/RenderStars";
import "../../styles/ReviewCard.css";

interface ReviewCardProps {
  review: Review;
  userPage?: boolean;
  userRevieForMovie?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  isLoggedUserMod?: boolean;
  commentCount?: number; // Dodaj nową prop dla liczby komentarzy
  displayCommentCount?: boolean;
  onNavigateToComments?: () => void; // Dodaj nową prop dla nawigacji do komentarzy
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
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
    navigate(`/${review.reviewId}/replies`);
  };

  return (
    <div
      className="d-flex justify-content-between align-items-start p-3 my-2 review-card"
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        color: "black",
        backgroundColor: review.isCritic ? "#CDC1FF" : "white",
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        {/* Username */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <p style={{ fontWeight: "bold", margin: 0 }}>
            {review.isCritic && (
              <span className="critic-badge">
                ✔️
                <span className="tooltip">Krytyk filmowy</span>
              </span>
            )}
            <Link
              to={`/user/${review.username}`}
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {review.username}
            </Link>
          </p>
          {userPage && (
            <Link
              to={`/${review.movieId}`}
              style={{
                fontWeight: "bold",
                fontStyle: "italic",
                textAlign: "center",
                flex: 1,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              Film: {review.movieTitle}
            </Link>
          )}
        </div>

        {/* Comment */}
        <p>{review.comment}</p>

        {/* Przyciski akcji i komentarze */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {(review.isOwner || isLoggedUserMod) &&
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
        {renderStars(review.rating)}
        <h4>{review.rating}/5</h4>
        <small>
          {review?.date
            ? new Date(review.date).toLocaleDateString("pl-PL", {
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

export default ReviewCard;
