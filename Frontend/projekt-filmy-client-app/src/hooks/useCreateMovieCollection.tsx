import { useState } from "react";
import axios from "axios";
import { Movie } from "../models/Movie";
import { useMovieLoader } from "./useMovieLoader";

export const useCreateMovieCollection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shareMode, setShareMode] = useState(0);
  const [allowCopy, setAllowCopy] = useState(false);
  const [movieIds, setMovieIds] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [tempSelectedMovies, setTempSelectedMovies] = useState<Movie[]>([]);

  const [filterList, setFilterList] = useState<[string[], string[], string[], string[]]>([[], [], [], []]);
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const [sortCategory, setSortCategory] = useState<string>("title");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState<string>("");

  const { data, isLoading, error: moviesError, isNoMovieModalVisible, setIsNoMovieModalVisible, refetch } = useMovieLoader(currentPage, 6, searchText, sortCategory, sortDirection, filterList);
  const movies = data?.movies ?? [];
  const pageInfo = {
    pageNumber: currentPage,
    pageSize: 6,
    totalPages: data?.totalPages ?? 1,
  };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  
  const handleOpenModal = async () => {
    refetch();
    setTempSelectedMovies([...selectedMovies]);
    setShowModal(true);
  };

  const handleToggleSelect = (movie: Movie) => {
    const alreadySelected = tempSelectedMovies.some((m) => m.movieId === movie.movieId);
    const updatedList = alreadySelected
      ? tempSelectedMovies.filter((m) => m.movieId !== movie.movieId)
      : [...tempSelectedMovies, movie];
    setTempSelectedMovies(updatedList);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    refetch();
  };

const handleCloseModal = async () => {
  setShowModal(false);
  setSearchText("");
  setCurrentPage(1);

  setSortCategory("title");
  setSortDirection("asc");
  setFilterList([[], [], [], []]);

  refetch();
};


  const handleConfirmSelection = () => {
    setSelectedMovies(tempSelectedMovies);
    setMovieIds(tempSelectedMovies.map((m) => m.movieId).join(","));
    setShowModal(false);
  };

  
const handleSort = async (type: string) => {
  const [category, direction] = type.split(" ");
  setSortCategory(category);
  setSortDirection(direction);
  setCurrentPage(1);

  refetch();
};

  const handleCreateCollection = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        shareMode,
        type: 2,
        allowCopy,
        movieIds: movieIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0),
      };

      await axios.post("https://localhost:7053/api/MovieCollection/add-collection", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return true;
    } catch (err) {
      console.error("Błąd przy tworzeniu kolekcji:", err);
      setError("Nie udało się utworzyć kolekcji. Spróbuj ponownie.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    shareMode,
    setShareMode,
    allowCopy,
    setAllowCopy,
    movieIds,
    setMovieIds,
    showModal,
    setShowModal,
    movies,
    selectedMovies,
    setSelectedMovies,
    tempSelectedMovies,
    setTempSelectedMovies,
    error,
    loading,
    handleOpenModal,
    handleToggleSelect,
    handleConfirmSelection,
    handleCreateCollection,
    currentPage,
    pageInfo,
    handlePageChange,
    searchText,
    setSearchText,
    handleCloseModal,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    setFilterList,
  };
};

export default useCreateMovieCollection;
