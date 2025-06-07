import { Movie } from "../../models/Movie";

interface SelectedMoviesListProps {
  selectedMovies: Movie[];
  setSelectedMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setMovieIds: React.Dispatch<React.SetStateAction<string>>;
}

const SelectedMoviesList: React.FC<SelectedMoviesListProps> = ({
  selectedMovies,
  setSelectedMovies,
  setMovieIds,
}) => {
  const handleRemove = (id: string) => {
    const updated = selectedMovies.filter((m) => m.movieId !== id);
    setSelectedMovies(updated);
    setMovieIds(updated.map((m) => m.movieId).join(","));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h4 style={{marginTop:"5%", marginBottom: "1rem" }}>Wybrane filmy</h4>
      {selectedMovies.length === 0 ? (
        <span style={{ color: "white", fontStyle: "italic" }}>
          Brak wybranych filmów
        </span>
      ) : (
        <div className="selected-movie-container">
          <div className="movie-scroll-container">
            {selectedMovies.map((movie) => (
              <div key={movie.movieId} className="movie-card">
                <img
                  src={movie.posterUrl || "/placeholder.png"}
                  alt={movie.title}
                  className="movie-card-img"
                />
                <div className="movie-card-body">
                  <p className="movie-title">{movie.title}</p>
                  <button
                    onClick={() => handleRemove(movie.movieId)}
                    className="remove-button"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedMoviesList;
