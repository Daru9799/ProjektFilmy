import { useState } from "react";
import { Movie } from "../models/Movie";
import { useMovieLoader } from "./useMovieLoader";

export const useMovieChoiceModule = () => {
  const [choosenMovieId, setChoosenMovieId] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [tempSelectedMovie, setTempSelectedMovie] = useState<Movie | null>(
    null
  ); // Zmienione na pojedynczy film
  const [filterList, setFilterList] = useState<
    [string[], string[], string[], string[]]
  >([[], [], [], []]);
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [sortCategory, setSortCategory] = useState<string>("title");
  const [currentPageMC, setCurrentPageMC] = useState(1);
  const [searchText, setSearchText] = useState<string>("");

  const { data, isLoading, error: moviesError, isNoMovieModalVisible, setIsNoMovieModalVisible, refetch, } = useMovieLoader( currentPageMC, 6, searchText, sortCategory, sortDirection, filterList );

  const movies = data?.movies ?? [];
  const pageInfoMC = {
    pageNumber: currentPageMC,
    pageSize: 6,
    totalPages: data?.totalPages ?? 1,
  };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = async () => {
    refetch();
    setShowModal(true);
  };

  const handleToggleSelect = (movie: Movie) => {
    // Jeśli wybrany film jest już zaznaczony, odznacz go
    if (tempSelectedMovie?.movieId === movie.movieId) {
      setTempSelectedMovie(null);
    } else {
      // W przeciwnym razie zaznacz nowy film
      setTempSelectedMovie(movie);
    }
  };

  const handlePageChangeMC = async (page: number) => {
    setCurrentPageMC(page);
    refetch();
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    setSearchText("");
    setCurrentPageMC(1);
    setSortCategory("title");
    setSortDirection("asc");
    setFilterList([[], [], [], []]);
    setTempSelectedMovie(null);

    refetch();
  };

  const handleConfirmSelection = () => {
    if (tempSelectedMovie) {
      setChoosenMovieId(tempSelectedMovie.movieId);
    }
    setShowModal(false);
  };

  const handleSort = async (type: string) => {
    const [category, direction] = type.split(" ");
    setSortCategory(category);
    setSortDirection(direction);
    setCurrentPageMC(1);

    refetch();
  };

  return {
    choosenMovieId,
    setChoosenMovieId,
    showModal,
    setShowModal,
    movies,
    tempSelectedMovie, // Zmienione na pojedynczy film
    setTempSelectedMovie, // Zmienione na pojedynczy film
    error,
    loading,
    handleOpenModal,
    handleToggleSelect,
    handleConfirmSelection,
    currentPageMC,
    pageInfoMC,
    handlePageChangeMC,
    searchText,
    setSearchText,
    handleCloseModal,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    setFilterList,
  };
};

export default useMovieChoiceModule;
