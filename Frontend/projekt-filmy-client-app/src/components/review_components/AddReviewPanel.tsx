import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { renderStars } from "../../functions/starFunction";
import "./ReviewCard.css";

interface AddReviewModalProps {
  show: boolean;
  onClose: () => void;
  onAddReview: (review: string, rating: number) => void;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  show,
  onClose,
  onAddReview,
}) => {
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(0);

  const handleSave = () => {
    if (reviewText.trim()&& reviewRating >= 0 && reviewRating <= 5) {
      onAddReview(reviewText, reviewRating);
      setReviewText("");
      setReviewRating(0);
      onClose();
    }
  };

  return (
<Modal
  show={show}
  onHide={onClose}
  centered
  // style={{width:"2000px",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  // }}
>
  <div
    className="d-flex justify-content-between align-items-start p-3 my-2 review-card"
    style={{
      borderRadius: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      color: "black",
      backgroundColor: "#7C00FE",
      // width: "1000px",
      // marginLeft:"-50%"     
    }}
  >
    <div style={{ flex: 1, textAlign: "left" , color:"white"}}>
      <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>critic1</p>
      <textarea
      style={{width:"100%"}}
        id="reviewText"
        className="form-control"
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Napisz swoją recenzję tutaj..."
      />
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
      <label htmlFor="reviewRating" className="form-label" style={{color:"white"}}>
        Ocena:
      </label>
      <input
      style={{textAlign:"center", width:"80%", marginLeft:"10%"}}
        type="number"
        id="reviewRating"
        className="form-control"
        step={0.1}
        min={0}
        max={5}
        value={reviewRating}
        onChange={(e) => {
          let value = parseFloat(e.target.value);
          if (value >= 0 && value <= 5) {
            setReviewRating(value);
          }
        }}
      />
    </div>
  </div>
  <Modal.Footer style={{ justifyContent: "center",  }}>
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

