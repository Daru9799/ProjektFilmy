import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MovieCollection.css";
import axios from "axios";
import MovieListModule from "../SearchMovies_componets/MovieListModule";
import { Modal } from "react-bootstrap";
import { Movie } from "../../models/Movie";

const CreateMovieCollection = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shareMode, setShareMode] = useState(0);
  const [allowCopy, setAllowCopy] = useState(true);
  const [movieIds, setMovieIds] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = async () => {
    try {
      const response = await axios.get("https://localhost:7053/api/Movies/by-filters", {
        params: {
          pageNumber: 1,
          pageSize: 10,
        },
      });
      setAvailableMovies(response.data.data.$values);
      setShowModal(true);
    } catch (error) {
      console.error("Błąd przy pobieraniu filmów:", error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleMovieSelect = (movie: Movie) => {
    if (!selectedMovies.find((m) => m.movieId === movie.movieId)) {
      const newList = [...selectedMovies, movie];
      setSelectedMovies(newList);
      setMovieIds(newList.map((m) => m.movieId).join(","));
    }
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
    } catch (err: any) {
      console.error("Błąd przy tworzeniu kolekcji:", err);
      setError("Nie udało się utworzyć kolekcji. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-collection-container">
      <h2 style={{ marginTop: "2%", marginBottom: "5%" }}>Utwórz nową kolekcję filmów</h2>

      <div className="form-grid">
        <div className="form-left">
          <div>
            <label>Tytuł:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label style={{ marginTop: "10%" }}>Tryb udostępniania:</label>
            <select value={shareMode} onChange={(e) => setShareMode(Number(e.target.value))}>
              <option value={0}>Prywatna</option>
              <option value={1}>Tylko znajomi</option>
              <option value={2}>Publiczna</option>
            </select>
          </div>

          <div className="checkbox-row">
            <label style={{ marginTop: "10%", marginLeft: "30%" }}>Pozwól na kopiowanie</label>
            <input
              type="checkbox"
              checked={allowCopy}
              style={{ marginTop: "13%" }}
              onChange={(e) => setAllowCopy(e.target.checked)}
            />
          </div>
        </div>

        <div className="form-right">
          <label>Opis:</label>
          <textarea
            style={{ marginLeft: "5%", width: "90%" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div style={{ marginTop: "5%" }}>
        <button className="green-button" onClick={handleOpenModal}>
          Dodaj film
        </button>
      </div>

      {selectedMovies.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h4>Wybrane filmy:</h4>
          <ul>
            {selectedMovies.map((movie) => (
              <li key={movie.movieId}>
                {movie.title}
                <button
                  onClick={() => {
                    const updated = selectedMovies.filter((m) => m.movieId !== movie.movieId);
                    setSelectedMovies(updated);
                    setMovieIds(updated.map((m) => m.movieId).join(","));
                  }}
                  style={{ marginLeft: "1rem", color: "red" }}
                >
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleCreateCollection}
        disabled={loading}
        className="edit-button"
        style={{ marginTop: "5%" }}
      >
        {loading ? "Tworzenie..." : "Utwórz kolekcję"}
      </button>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Wybierz film do dodania</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MovieListModule movieList={availableMovies} onSelect={handleMovieSelect} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CreateMovieCollection;
