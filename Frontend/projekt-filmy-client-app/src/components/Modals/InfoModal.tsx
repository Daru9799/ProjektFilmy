import React from "react";
import { Modal, Button } from "react-bootstrap";

interface InfoModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "success" | "danger" | "warning";
}

const InfoModal = ({ show, onClose, title, message, variant = "danger" }: InfoModalProps) => {
  const colorMap = { success: "green", danger: "red", warning: "#ffc107" };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: "flex", alignItems: "center", color: colorMap[variant], fontWeight: "bold" }}>
          {message}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={variant} onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
