import React from "react";
import { Modal, Button } from "react-bootstrap";

interface Props {
  show: boolean; // Czy modal jest widoczny
  onClose: () => void; // Funkcja zamykająca modal
}

const NoMoviesModal = ({ show, onClose }:Props) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Brak wyników</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Nie znaleziono żadnych filmów w bazie danych spełniających podane
          kryteria. Spróbuj zmienić filtry wyszukiwania.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Zamknij
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NoMoviesModal;
