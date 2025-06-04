import React from "react";
import { Modal } from "react-bootstrap";
import { Movie } from "../../models/Movie";
import MovieListModule from "../SearchMovies_componets/MovieListModule";

type Props = {
  show: boolean;
  onClose: () => void;
  availableMovies: Movie[];
  tempSelectedMovies: Movie[];
  onToggleSelect: (movie: Movie) => void;
  onConfirm: () => void;
};

const MovieSelectionModal: React.FC<Props> = ({
  show,
  onClose,
  availableMovies,
  tempSelectedMovies,
  onToggleSelect,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Wybierz filmy do dodania</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MovieListModule
          movieList={availableMovies}
          tempSelectedMovies={tempSelectedMovies}
          onToggleSelect={onToggleSelect}
        />
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center mt-4 gap-3">
        <button className="cancel-button" onClick={onClose}>
          Anuluj
        </button>
        <button className="green-button" onClick={onConfirm}>
          Zatwierdź wybór
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MovieSelectionModal;
