import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { renderStars } from "../../functions/starFunction";
import "./ReviewCard.css";

interface AddReviewModalProps {
  show: boolean;
  onClose: () => void;
  onAddReview: (review: string, rating: number) => void;
  initialReviewText?: string; 
  initialReviewRating?: number; 
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  show,
  onClose,
  onAddReview,
  initialReviewText = "",
  initialReviewRating = 0,
}) => {
  const [reviewText, setReviewText] = useState<string>(initialReviewText);
  const [reviewRating, setReviewRating] = useState<number>(initialReviewRating);

  useEffect(() => {
    setReviewText(initialReviewText);
    setReviewRating(initialReviewRating);
  }, [show, initialReviewText, initialReviewRating]);

  const handleSave = () => {
    if (reviewText.trim() && reviewRating > 0 && reviewRating <= 5) {
      onAddReview(reviewText, reviewRating);
      setReviewText("");
      setReviewRating(0);
      onClose();
    }
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseFloat(e.target.value);
    if (value > 0 && value <= 5) {
      value = Math.round(value * 10) / 10; 
      setReviewRating(value);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <div
        className="d-flex justify-content-between align-items-start p-3 my-2 review-card"
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          color: "black",
          backgroundColor: "#7C00FE",
        }}
      >
        <div style={{ flex: 1, textAlign: "left", color: "white" }}>
          <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Critic</p>
          <textarea
            className="form-control"
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Wpisz komentarz..."
            maxLength={500}
            style={{
              width: "100%",
              borderRadius: "8px",
              padding: "10px",
            }}
          />
          <p style={{ color: "white", fontSize: "12px" }}>
            Maksymalnie 500 znaków
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            color: "black",
            marginLeft: "20px",
            width: "22%",
          }}
        >
          <div className="mb-3">{renderStars(reviewRating)}</div>
          <label htmlFor="reviewRating" className="form-label" style={{ color: "white" }}>
            Ocena:
          </label>
          <input
            type="number"
            className="form-control"
            step={0.5}
            min={0}
            max={5}
            value={reviewRating}
            onChange={handleRatingChange} 
            style={{
              textAlign: "center",
              width: "80%",
              marginLeft: "10%",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
      <Modal.Footer style={{ justifyContent: "center" }}>
        <button className="btn btn-secondary mx-2" onClick={onClose}>
          Anuluj
        </button>
        <button className="btn btn-primary mx-2" onClick={handleSave}>
          Zapisz
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddReviewModal;
