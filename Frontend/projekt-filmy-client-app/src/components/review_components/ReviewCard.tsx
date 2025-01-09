import React from "react";
import { Link } from "react-router-dom";
import { Review } from "../../models/Review";
import { renderStars } from "../../functions/starFunction";
import "./ReviewCard.css";

interface ReviewCardProps {
  review: Review;
  showMovieTitle?: boolean;
  onDelete?: () => void; 
  onEdit?: () => void; 
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showMovieTitle, onDelete, onEdit }) => {
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
        <div
          className="d-flex align-items-center justify-content-between mb-2"
          style={{ display: "flex" }}
        >
          <p style={{ fontWeight: "bold", margin: 0 }}>
            {review.isCritic && (
              <span className="critic-badge">
                ✔️
                <span className="tooltip">Krytyk filmowy</span>
              </span>
            )}
            {review.username}
          </p>
          {showMovieTitle && (
            <Link
              to={`/${review.movieId}`}
              style={{
                fontWeight: "bold",
                fontStyle: "italic",
                marginInline: "30%",
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
        <p>{review.comment}</p>
        {showMovieTitle && (
          <div className="d-flex justify-content-end">
            {/* Przycisk edycji */}
            <button
              className="btn btn-secondary me-2"
              style={{
                background: "none",
                border: "none",
                color: "#16C47F",
                cursor: "pointer",
               
              }}
              onClick={onEdit}
              aria-label="Edytuj recenzję"
            >
              <i className="fas fa-edit"></i> {/* Ikona ołówka */}
            </button>
            {/* Przycisk usuwania */}
            <button
              className="btn btn-danger"
              style={{
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer",
                marginLeft:"2%",
                marginRight:"41%"
              }}
              onClick={onDelete}
              aria-label="Usuń recenzję"
            >
              <i className="fas fa-trash"></i> {/* Ikona kosza */}
            </button>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default ReviewCard;
