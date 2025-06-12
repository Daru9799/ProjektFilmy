import React from "react";
import { Modal } from "react-bootstrap";
import { Movie } from "../../models/Movie";
import MovieListModule from "../SearchMovies_componets/MovieListModule";
import PaginationModule from "../SharedModals/PaginationModule";
import SearchModule from "../SharedModals/SearchModule";
import FilterMovieModule from "../SearchMovies_componets/FilterMovieModule";
import SortMovieModule from "../SearchMovies_componets/SortMovieModule";
import NoMoviesModal from "../SearchMovies_componets/NoMoviesModal";

type Props = {
  show: boolean;
  onClose: () => void;
  movies: Movie[]; //Lista pobranych filmów
  tempSelectedMovie: Movie | null;
  onToggleSelect: (movie: Movie) => void;
  onConfirm: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  setFilterList: (filters: [string[], string[], string[], string[]]) => void;
  handleSort: (sort: string) => void;
  isNoMovieModalVisible: boolean;
  setIsNoMovieModalVisible: (visible: boolean) => void;
};

const MovieSingleChoiceModal: React.FC<Props> = ({
  show,
  onClose,
  movies,
  tempSelectedMovie,
  onToggleSelect,
  onConfirm,
  currentPage,
  totalPages,
  onPageChange,
  setSearchText,
  setFilterList,
  handleSort,
  isNoMovieModalVisible,
  setIsNoMovieModalVisible,
}) => {
  const handleClose = () => {
    setSearchText("");
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      dialogClassName="custom-modal"
    >
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

        <FilterMovieModule getFilters={setFilterList} />

        <SortMovieModule onSort={handleSort} />

        <MovieListModule
          movieList={movies}
          tempSelectedMovies={tempSelectedMovie ? [tempSelectedMovie] : []}
          onToggleSelect={onToggleSelect}
        />

        {totalPages > 1 && (
          <PaginationModule
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}

        <NoMoviesModal
          show={isNoMovieModalVisible}
          onClose={() => setIsNoMovieModalVisible(false)}
        />
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

export default MovieSingleChoiceModal;
