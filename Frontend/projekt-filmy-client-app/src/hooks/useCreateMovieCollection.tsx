import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Movie } from "../models/Movie";


export const useCreateMovieCollection = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shareMode, setShareMode] = useState(0);
  const [allowCopy, setAllowCopy] = useState(true);
  const [movieIds, setMovieIds] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [tempSelectedMovies, setTempSelectedMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = async () => {
    try {
      const response = await axios.get("https://localhost:7053/api/Movies/by-filters", {
        params: { pageNumber: 1, pageSize: 8 },
      });
      setAvailableMovies(response.data.data.$values);
      setTempSelectedMovies(selectedMovies);
      setShowModal(true);
    } catch (error) {
      console.error("Błąd przy pobieraniu filmów:", error);
    }
  };

  const handleToggleSelect = (movie: Movie) => {
    const alreadySelected = tempSelectedMovies.some((m) => m.movieId === movie.movieId);
    const updatedList = alreadySelected
      ? tempSelectedMovies.filter((m) => m.movieId !== movie.movieId)
      : [...tempSelectedMovies, movie];

    setTempSelectedMovies(updatedList);
  };

  const handleConfirmSelection = () => {
    setSelectedMovies(tempSelectedMovies);
    setMovieIds(tempSelectedMovies.map((m) => m.movieId).join(","));
    setShowModal(false);
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

      alert("Kolekcja została utworzona!");
      navigate("/");
    } catch (err) {
      console.error("Błąd przy tworzeniu kolekcji:", err);
      setError("Nie udało się utworzyć kolekcji. Spróbuj ponownie.");
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
    availableMovies,
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
  };
};

export default useCreateMovieCollection;
