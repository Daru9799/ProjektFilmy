import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../models/Movie';
import { renderStars } from "../../hooks/RenderStars";
import '../../styles/Zoom.css';

interface Props {
  movieList: Movie[];
  onSelect?: (movie: Movie) => void;
  tempSelectedMovies?: Movie[];
  onToggleSelect?: (movie: Movie) => void;
}

const MovieListModule = ({
  movieList,
  onToggleSelect,
  tempSelectedMovies = [],
}: Props) => {
  const navigate = useNavigate();

  const isSelected = (movie: Movie) =>
    tempSelectedMovies.some((m) => m.movieId === movie.movieId);

  const handleCardClick = (movie: Movie) => {
    if (onToggleSelect) {
      onToggleSelect(movie); // Multi-select mode
    } else {
      navigate(`/${movie.movieId}`); // Navigation
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {movieList.map((movie) => (
          <li
            key={movie.movieId}
           className={`list-group-item d-flex p-3 zoomCard ${isSelected(movie) ? 'selected-movie-highlight' : ''}`}
            onClick={() => handleCardClick(movie)}
            style={{
              borderBottom: "1px solid #ddd",
              width: "600px",
              height: "180px",
              borderRadius: "15px",
              marginBottom: "5px",
              cursor: "pointer",
            }}
          >
            <img
              src={movie.posterUrl}
              alt={`${movie.title} Poster`}
              style={{
                width: "100px",
                height: "150px",
                objectFit: "cover",
                marginRight: "15px",
                borderRadius: "5px",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div className="d-flex justify-content-between align-items-start" style={{ flexGrow: 1 }}>
                <h5
                  className="mb-2"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "left",
                    maxWidth: "300px",
                  }}
                >
                  {movie.title} (
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("pl-PL", {
                        year: "numeric",
                      })
                    : null}
                  )
                </h5>
                <div className="d-flex flex-column align-items-end" style={{ marginLeft: "40px" }}>
                  <div>{renderStars(movie.averageScore || 0)}</div>
                  <span style={{ fontSize: "1rem" }}>
                    {Number(movie.averageScore).toFixed(1)}/5
                  </span>
                  <p className="mb-0 mt-2" style={{ fontSize: "0.9rem", textAlign: "left" }}>
                    Ilość ocen: {movie.scoresNumber || "0"}
                  </p>
                </div>
              </div>
              <div
                className="d-flex flex-wrap"
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  justifyContent: "flex-start",
                  marginTop: "auto",
                }}
              >
                {movie?.categories?.$values?.length ? (
                  movie.categories.$values.map((cat) => (
                    <div
                      key={cat.name}
                      className="badge me-2 mb-2"
                      style={{
                        backgroundColor: "#2E5077",
                        padding: "8px 12px",
                        textAlign: "center",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        borderRadius: "15px",
                      }}
                    >
                      {cat.name}
                    </div>
                  ))
                ) : (
                  <p className="text-dark" style={{ marginTop: "10px" }}>
                    Brak danych o gatunkach.
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieListModule;
