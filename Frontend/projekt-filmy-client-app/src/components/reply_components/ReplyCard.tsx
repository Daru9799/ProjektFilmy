import React, { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../SharedModals/ConfirmationModal";
import "../../styles/ReviewCard.css";
import { Reply } from "../../models/Reply";

interface ReplyCardProps {
  reply: Reply;
  onDelete?: () => void;
  onEdit?: () => void;
  isLoggedUserMod?: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  onDelete,
  onEdit,
  isLoggedUserMod,
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

  return (
    <div
      className="d-flex justify-content-between align-items-start p-3 my-2 review-card"
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        color: "black",
        backgroundColor: "white",
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        {/* Username */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <p style={{ fontWeight: "bold", margin: 0 }}>
            <Link
              to={`/user/${reply.username}`}
              style={{
                fontWeight: "bold",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {reply.username}
            </Link>
          </p>
        </div>

        {/* Comment */}
        <p>{reply.comment}</p>

        {/* Przyciski akcji i komentarze */}
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {(reply.isOwner || isLoggedUserMod) && (
              <>
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
                  <i className="fas fa-edit zoomIcons"></i>
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
                  <i className="fas fa-trash zoomIcons"></i>
                </button>
              </>
            )}
        </div>
      </div>

      {/* Data */}
      <div style={{ textAlign: "right", color: "black" }}>
        <small>
          {reply?.date
            ? new Date(reply.date).toLocaleDateString("pl-PL", {
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

export default ReplyCard;
