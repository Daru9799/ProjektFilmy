import React from "react";
import { Modal, Button } from "react-bootstrap";

interface InfoModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  show,
  onClose,
  title = "Informacja",
  message = "Brakuje wymaganych danych.",
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Zamknij
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
