import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { Review } from "../../models/Review";
import { renderStars } from "../../hooks/RenderStars";

interface ReviewCardProps {
  review: Review;
  userPage?: boolean;
  userRevieForMovie?:boolean;
  onDelete?: () => void; 
  onEdit?: () => void; 
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, userPage,userRevieForMovie, onDelete, onEdit }) => {
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
        <div
          className="d-flex align-items-center justify-content-between mb-2"
        >
          <p style={{ fontWeight: "bold", margin: 0 }}>
            {review.isCritic && (
              <span className="critic-badge">
                ✔️
                <span className="tooltip">Krytyk filmowy</span>
              </span>
            )}
            <Link
            to={`/user/${review.username}`}  // Zmiana: dynamiczny link do profilu użytkownika
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

        
        {(review.isOwner && (userPage || userRevieForMovie)) && (
          <div className="d-flex" style={{ marginTop: "-10px" }}>
            <button
              className="btn btn-secondary me-2"
              style={{
                background: "none",
                border: "none",
                color: "black",
                cursor: "pointer",
              }}
              onClick={onEdit}
              aria-label="Edytuj recenzję"
            >
              <i className="fas fa-edit zoomIcons"></i> {/* Ikona ołówka */}
            </button>
            <button
              className="btn btn-danger"
              style={{
                background: "none",
                border: "none",
                color: "black",
                cursor: "pointer",
              }}
              onClick={handleDeleteClick}
              aria-label="Usuń recenzję"
            >
              <i className="fas fa-trash zoomIcons"></i> {/* Ikona kosza */}
            </button>
          </div>
        )}
      </div>

      {/* Rating  Date */}
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
      <Modal show={showModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Potwierdzenie usunięcia</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz usunąć tę recenzję?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Anuluj
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Usuń
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewCard;
