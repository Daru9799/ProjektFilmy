import React, { useState, useEffect } from "react";

interface ReplyFormModalProps {
  show: boolean;
  onClose: () => void;
  onAddReply: (reply: string) => void;
  initialReplyText?: string;
  headerText: string;
  buttonText: string;
}

const ReplyFormModal: React.FC<ReplyFormModalProps> = ({
  show,
  onClose,
  onAddReply,
  initialReplyText = "",
  headerText,
  buttonText,
}) => {
  const [replyText, setReplyText] = useState<string>(initialReplyText);

  useEffect(() => {
    setReplyText(initialReplyText);
  }, [show, initialReplyText]);

  const handleSave = () => {
    if (replyText.trim()) {
      onAddReply(replyText);
      setReplyText("");
      onClose();
    }
  };

  if (!show) return null;

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
          style={{
            borderRadius: "15px",
            backgroundColor: "#ffffffff",
            color: "black",
          }}
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

            {/* Pole tekstowe */}
            <textarea
              className={`form-control mb-3 ${replyText ? "is-valid" : ""}`}
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Wpisz odpowiedź..."
              style={{ borderRadius: "2px", resize: "none" }}
            />

            {/* Przycisk */}
            <button
              className="btn btn-success px-5"
              onClick={handleSave}
              disabled={!replyText}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyFormModal;