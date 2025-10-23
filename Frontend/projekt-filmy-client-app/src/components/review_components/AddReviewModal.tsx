import React, { useState, useEffect } from "react";
import { renderStars } from "../../hooks/RenderStars";

interface AddReviewModalProps {
  show: boolean;
  onClose: () => void;
  onAddReview: (review: string, rating: number) => void;
  initialReviewText?: string;
  initialReviewRating?: number;
  headerText: string;
  buttonText: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  show,
  onClose,
  onAddReview,
  initialReviewText = "",
  initialReviewRating = 0,
  headerText,
  buttonText,
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

  const handleRatingChange = (value: number) => {
    const rounded = Math.round(value * 2) / 2;
    if (rounded >= 0 && rounded <= 5) {
      setReviewRating(rounded);
    }
  };

  if (!show) return null;

  //Funkcja renderująca gwiazdki z możliwością kliknięcia (z połówkami)
  const renderClickableStars = () => {
    const stars = renderStars(reviewRating).props.children;
    return React.Children.map(stars, (star, index) => {
      const fullValue = index + 1;
      return (
        <span style={{ display: "inline-block", position: "relative", cursor: "pointer" }}>
          {/* Kliknięcie po lewej połowie = 0.5 */}
          <span
            style={{ position: "absolute", left: 0, width: "50%", height: "100%" }}
            onClick={() => handleRatingChange(fullValue - 0.5)}
          />
          {/* Kliknięcie po prawej połowie = pełna gwiazdka */}
          <span
            style={{ position: "absolute", right: 0, width: "50%", height: "100%" }}
            onClick={() => handleRatingChange(fullValue)}
          />
          {star}
        </span>
      );
    });
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div
          className="modal-content"
          style={{ borderRadius: "15px", backgroundColor: "#ffffffff", color: "black" }}
        >
          {/* Krzyżyk do zamykania */}
          <div className="text-end p-2">
            <button
              type="button"
              className="btn-close btn-close-black"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          {/* Ciało modala */}
          <div className="modal-body text-center">
            {/* Tytuł */}
            <h4 className="mb-3">{headerText}</h4>
            {/* Gwiazdki */}
            <div className="mb-3" style={{ fontSize: "1.5rem" }}>
              {renderClickableStars()}
            </div>
            {/* Tekst recenzji */}
            <textarea
              className={`form-control mb-3 ${reviewText ? "is-valid" : ""}`}
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Wpisz recenzję..."
              style={{ borderRadius: "2px", resize: "none" }}
            />
            {/* Zapisz */}
            <button className="btn btn-success px-5" onClick={handleSave} disabled={!reviewText}>
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;