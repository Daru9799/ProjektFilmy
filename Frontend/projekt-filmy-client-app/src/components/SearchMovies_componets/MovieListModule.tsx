import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importuj useNavigate
import { Movie } from '../../models/Movie';
import { renderStars } from "../../hooks/RenderStars";
import '../../styles/Zoom.css'

interface Props {
  movieList: Movie[];
}

const MovieListModule = ({ movieList }: Props) => {
  const navigate = useNavigate();

  const handleCardClick = (movieId: string) => {
    navigate(`/${movieId}`); 
  };

  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {movieList.map((movie) => (
          <li
            key={movie.title}
            className="list-group-item d-flex p-3 zoomCard"
            onClick={() => handleCardClick(movie.movieId)} // Obsługa kliknięcia
            style={{
              borderBottom: "1px solid #ddd",
              width: "600px",
              height: "180px",
              borderRadius: "15px",
              marginBottom: "5px",
              display: "flex",
              flexDirection: "row",
              cursor: "pointer", // Wskaźnik kursora zmienia się na "rękę"
            }
          }
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
              {/* Tytuł filmu i oceny */}
              <div className="d-flex justify-content-between align-items-start" style={{ flexGrow: 1 }}>
                {/* Tytuł filmu */}
                <h5
                  className="mb-2"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "left",
                    maxWidth: "300px"
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

                {/* Gwiazdki i ilość ocen */}
                <div
                  className="d-flex flex-column align-items-end"
                  style={{ marginLeft: "40px" }}
                >
                  <div>{renderStars(movie.averageScore || 0)}</div>
                  <span style={{ fontSize: "1rem" }}>
                    {Number(movie.averageScore).toFixed(1)}/5
                  </span>
                  <p className="mb-0 mt-2" style={{ fontSize: "0.9rem", textAlign: "left" }}>
                    Ilość ocen: {movie.scoresNumber || "0"}
                  </p>
                </div>
              </div>

              {/* Gatunki */}
              <div
                className="d-flex flex-wrap"
                style={{
                  fontSize: "0.9rem",
                  color: "#555",
                  justifyContent: "flex-start",
                  marginTop: "auto", // Gatunki będą zawsze na dole
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
