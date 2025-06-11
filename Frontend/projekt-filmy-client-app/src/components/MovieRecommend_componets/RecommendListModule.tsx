import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../models/Movie";
import { renderStars } from "../../hooks/RenderStars";
import "../../styles/Zoom.css";
import { useState, useEffect } from "react";
import { Recommendation } from "../../models/Recommendation";


interface Props {
  movieList: Movie[];
  recommendations: Recommendation[];
  onSelect?: (movie: Movie) => void;
  onLikeToggle?: (recommendationId: string, isLiking: boolean) => void;
}

const RecommendListModule = ({
  movieList = [],
  recommendations=[],
  onSelect,
  onLikeToggle,
}: Props) => {
  const navigate = useNavigate();
  const [localRecommendations, setLocalRecommendations] = useState<Recommendation[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany (czy istnieje token)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (recommendations) {
      setLocalRecommendations(recommendations);
    }
  }, [recommendations]);

  const handleCardClick = (movie: Movie) => {
    if (onSelect) {
      onSelect(movie);
    } else {
      navigate(`/${movie.movieId}`);
    }
  };

  const handleLikeClick = async (
    recommendationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      return;
    }

    try {
      const recommendationIndex = localRecommendations.findIndex(
        (r) => r.recommendationId === recommendationId
      );

      if (recommendationIndex === -1) return;

      const currentRecommendation = localRecommendations[recommendationIndex];
      const newIsLiking = !currentRecommendation.isLiking;

      // Optymistyczna aktualizacja UI
      const updatedRecommendations = [...localRecommendations];
      updatedRecommendations[recommendationIndex] = {
        ...currentRecommendation,
        isLiking: newIsLiking,
        likesCounter: newIsLiking
          ? currentRecommendation.likesCounter + 1
          : currentRecommendation.likesCounter - 1,
      };

      setLocalRecommendations(updatedRecommendations);

      // Wywołanie funkcji z propsów do aktualizacji na backendzie
      if (onLikeToggle) {
        await onLikeToggle(recommendationId, newIsLiking);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Wycofanie zmian w przypadku błędu
      setLocalRecommendations([...localRecommendations]);
    }
  };

  // Łączenie danych o filmach z rekomendacjami
  const getCombinedData = () => {
    if (!Array.isArray(movieList)) {
      console.warn("movieList is not an array, using empty array as fallback");
      return [];
    }

    return movieList.map((movie) => {
      const recommendation = (localRecommendations || []).find(
        (rec) => rec.recommendedMovieId === movie.movieId
      );
      return { movie, recommendation };
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {getCombinedData().map(({ movie, recommendation }) => (
          <li
            key={movie.movieId}
            className="list-group-item d-flex p-3 zoomCard"
            onClick={() => handleCardClick(movie)}
            style={{
              borderBottom: "1px solid #ddd",
              width: "600px",
              height: "150px",
              borderRadius: "15px",
              marginBottom: "5px",
              display: "flex",
              flexDirection: "row",
              cursor: "pointer",
            }}
          >
            <img
              src={movie.posterUrl}
              alt={`${movie.title} Poster`}
              style={{
                width: "80px",
                height: "120px",
                objectFit: "cover",
                marginRight: "15px",
                borderRadius: "5px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-start"
                style={{ flexGrow: 1 }}
              >
                <h6
                  className="mb-2"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    textAlign: "left",
                    maxWidth: "250px",
                  }}
                >
                  {movie.title} (
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("pl-PL", {
                        year: "numeric",
                      })
                    : null}
                  )
                </h6>

                <div
                  className="d-flex flex-column align-items-end"
                  style={{ marginLeft: "auto", marginTop: "auto" }}
                >
                  <div>{renderStars(movie.averageScore || 0)}</div>
                  <span style={{ fontSize: "1rem" }}>
                    {Number(movie.averageScore).toFixed(1)}/5
                  </span>
                  <p
                    className="mb-0 mt-2"
                    style={{ fontSize: "0.8rem", textAlign: "left" }}
                  >
                    Ilość ocen: {movie.scoresNumber || "0"}
                  </p>
                </div>

                {/* Sekcja polubień */}
                {recommendation && (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center"
                    style={{
                      marginLeft: "20px",
                      minWidth: "80px",
                      height: "100%",
                    }}
                    onClick={(e) =>
                      isLoggedIn &&
                      handleLikeClick(recommendation.recommendationId, e)
                    }
                  >
                    <button
                      disabled={!isLoggedIn}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: isLoggedIn ? "pointer" : "default",
                        fontSize: "2rem",
                        color: !isLoggedIn
                          ? "#adb5bd"
                          : recommendation.isLiking
                          ? "#dc3545"
                          : "#6c757d",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        opacity: isLoggedIn ? 1 : 0.65,
                      }}
                      title={
                        !isLoggedIn
                          ? "Zaloguj się, aby polubić"
                          : recommendation.isLiking
                          ? "Usuń like"
                          : "Dodaj like"
                      }
                    >
                      <i
                        className={
                          recommendation.isLiking
                            ? "bi bi-heart-fill"
                            : "bi bi-heart"
                        }
                      />
                    </button>
                    <span
                      style={{
                        fontSize: "1rem",
                        marginTop: "5px",
                        textAlign: "center",
                        width: "100%",
                        color: !isLoggedIn ? "#adb5bd" : "inherit",
                      }}
                    >
                      {recommendation.likesCounter || 0}
                    </span>
                  </div>
                )}
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

export default RecommendListModule;
