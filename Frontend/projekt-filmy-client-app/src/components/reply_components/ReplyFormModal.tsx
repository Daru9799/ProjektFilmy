import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  onAddReview: (review: string) => void;
  initialReviewText?: string;
  initialReviewRating?: number;
}

const ReplyFormModal: React.FC<Props> = ({
  show,
  onClose,
  onAddReview,
  initialReviewText = "",
}) => {
  const [replyText, setReplyText] = useState<string>(initialReviewText);

  useEffect(() => {
    setReplyText(initialReviewText);;
  }, [show, initialReviewText]);

  const handleSave = () => {
    if (replyText.trim()) {
      onAddReview(replyText);
      setReplyText("");;
      onClose();
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
          <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}></p>
          <textarea
            className="form-control"
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Wpisz komentarz..."
            maxLength={500}
            style={{
              width: "100%",
              borderRadius: "8px",
              padding: "10px",
            }}
          />
          <p style={{ color: "white", fontSize: "12px" }}>
            {`${replyText.length}/500`}
          </p>
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

export default ReplyFormModal;
