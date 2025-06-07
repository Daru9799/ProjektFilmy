import FilterMovieModule from "./FilterMovieModule";
import SortMovieModule from "./SortMovieModule";
import MovieListModule from "./MovieListModule";
import NoMoviesModal from "./NoMoviesModal";
import { useSearchMovies } from "../../hooks/useMovieSearch";
import SearchModule from "../SharedModals/SearchModule";
import PaginationModule from "../SharedModals/PaginationModule";


const SearchMoviesPage = () => {
  const {
    setSearchText,
    setFilterList,
    movies,
    pageInfo,
    currentPage,
    handlePageChange,
    handleSearchSubmit,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
  } = useSearchMovies();

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <SearchModule
        placeHolderText="Podaj tytuł filmu"
        getText={setSearchText}
        submit={handleSearchSubmit}
      />

      <FilterMovieModule getFilters={setFilterList} />

      <SortMovieModule onSort={handleSort} />

      <PaginationModule
        currentPage={currentPage}
        totalPages={pageInfo.totalPages}
        onPageChange={handlePageChange}
      />

      <MovieListModule movieList={movies} />

      <div className="mt-auto">
        <PaginationModule
          currentPage={currentPage}
          totalPages={pageInfo.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <NoMoviesModal
        show={isNoMovieModalVisible}
        onClose={() => setIsNoMovieModalVisible(false)}
      />
    </div>
  );
};

export default SearchMoviesPage;
