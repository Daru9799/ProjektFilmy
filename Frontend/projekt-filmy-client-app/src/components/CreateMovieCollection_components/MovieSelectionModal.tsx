import React from "react";
import { Modal } from "react-bootstrap";
import { Movie } from "../../models/Movie";
import MovieListModule from "../SearchMovies_componets/MovieListModule";
import PaginationModule from "../SharedModals/PaginationModule";
import SearchModule from "../SharedModals/SearchModule";


type Props = {
  show: boolean;
  onClose: () => void;
  movies: Movie[];
  tempSelectedMovies: Movie[];
  onToggleSelect: (movie: Movie) => void;
  onConfirm: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchText: string;
  setSearchText: (text: string) => void;
};

const MovieSelectionModal: React.FC<Props> = ({
  show,
  onClose,
  movies,
  tempSelectedMovies,
  onToggleSelect,
  onConfirm,
  currentPage,
  totalPages,
  onPageChange,
  setSearchText
}) => {

  const handleClose = () => {
    setSearchText("");
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Wybierz filmy do dodania</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <SearchModule
          key={show ? "open" : "closed"} 
          placeHolderText="Szukaj filmów..."
          getText={(text) => {
            setSearchText(text);
            onPageChange(1);
          }}
          submit={() => onPageChange(1)}
        />

        <MovieListModule
          movieList={movies}
          tempSelectedMovies={tempSelectedMovies}
          onToggleSelect={onToggleSelect}
        />

        {totalPages > 1 && (
          <PaginationModule
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}

      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center mt-4 gap-3">
        <button className="cancel-button" onClick={handleClose}>
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
