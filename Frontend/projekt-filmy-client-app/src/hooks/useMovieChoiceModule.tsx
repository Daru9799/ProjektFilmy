import { useState } from "react";
import axios from "axios";
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

  const {
    movies,
    pageInfo: pageInfoMC,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    loadMovies,
  } = useMovieLoader(6);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = async () => {
    await loadMovies({
      page: currentPageMC,
      searchText,
      pageSize: 6,
      sortCategory: "title",
      sortDirection,
      filterList,
    });
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
    await loadMovies({
      page,
      searchText,
      pageSize: 6,
      sortCategory: "title",
      sortDirection,
      filterList,
    });
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    setSearchText("");
    setCurrentPageMC(1);
    setSortCategory("title");
    setSortDirection("asc");
    setFilterList([[], [], [], []]);
    setTempSelectedMovie(null);

    await loadMovies({
      page: 1,
      searchText: "",
      pageSize: 6,
      sortCategory: "title",
      sortDirection: "asc",
      filterList: [[], [], [], []],
    });
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

    await loadMovies({
      page: 1,
      searchText,
      pageSize: 6,
      sortCategory: category,
      sortDirection: direction,
      filterList,
    });
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
