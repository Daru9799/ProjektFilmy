import React from "react";
import { Review } from "../../models/Review";
import { renderStars } from "../../functions/starFunction";
import "./ReviewCard.css"; // Plik CSS dla recenzji

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div
      className="d-flex justify-content-between align-items-start p-3 my-2 review-card"
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        color: "black",
        backgroundColor: review.isCritic ? "#CDC1FF" : "white", // Specjalne tło dla krytyków
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        <p style={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
          
          {review.isCritic && (
            <span className="critic-badge">
              ✔️
              <span className="tooltip">Krytyk filmowy</span>
            </span>
            
          )}
          {review.username}
        </p>
        <p>{review.comment}</p>
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


