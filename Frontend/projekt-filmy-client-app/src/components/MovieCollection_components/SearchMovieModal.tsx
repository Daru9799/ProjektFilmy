import { Modal } from "react-bootstrap";
import { useMovieSearch } from "../../hooks/useMovieSearch";
import SearchModule from "../SearchModule";
import { Movie } from "../../models/Movie";
import FilterMovieModule from "../SearchMovies_componets/FilterMovieModule";
import SortMovieModule from "../SearchMovies_componets/SortMovieModule";
import PaginationModule from "../PaginationModule";
import MovieListModule from "../SearchMovies_componets/MovieListModule";

interface Props {
  show: boolean;
  onClose: () => void;
  onMovieSelect: (movie: Movie) => void;
}

const MovieSelectModal = ({ show, onClose, onMovieSelect }: Props) => {
  const {
    searchText,
    setSearchText,
    filterList,
    setFilterList,
    sortCategory,
    setSortCategory,
    sortDirection,
    setSortDirection,
    movies,
    pageInfo,
    setCurrentPage,
    fetchMovies,
  } = useMovieSearch();

  const handleSort = (type: string) => {
    const [cat, dir] = type.split(" ");
    setSortCategory(cat);
    setSortDirection(dir);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Wybierz film</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchModule
          placeHolderText="Szukaj filmu"
          getText={setSearchText}
          submit={fetchMovies}
        />
        <FilterMovieModule getFilters={setFilterList} />
        <SortMovieModule onSort={handleSort} />
        <PaginationModule
          currentPage={pageInfo.pageNumber}
          totalPages={pageInfo.totalPages}
          onPageChange={setCurrentPage}
        />
        <MovieListModule
          movieList={movies}
          onSelect={(movie) => {
            onMovieSelect(movie);
            onClose();
          }}
        />
        <PaginationModule
          currentPage={pageInfo.pageNumber}
          totalPages={pageInfo.totalPages}
          onPageChange={setCurrentPage}
        />
      </Modal.Body>
    </Modal>
  );
};

export default MovieSelectModal;
