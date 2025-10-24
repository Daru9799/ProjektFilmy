import { useState } from "react";
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

  const { data, isLoading: isMovieLoading, apiError: moviesError, isNoMovieModalVisible, setIsNoMovieModalVisible, refetch } = useMovieLoader(currentPage, 6, searchText, sortCategory, sortDirection, filterList);
  const movies = data?.movies ?? [];
  const pageInfo = {
    pageNumber: currentPage,
    pageSize: 6,
    totalPages: data?.totalPages ?? 1,
  };

  
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
    isMovieLoading,
    moviesError,
    selectedMovies,
    setSelectedMovies,
    tempSelectedMovies,
    setTempSelectedMovies,
    handleOpenModal,
    handleToggleSelect,
    handleConfirmSelection,
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
