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

  const LikeSection = ({
    recommendation,
  }: {
    recommendation: Recommendation;
  }) => (
    <div
      className="like-section d-flex flex-column align-items-center justify-content-center"
      onClick={(e) =>
        isLoggedIn && handleLikeClick(recommendation.recommendationId, e)
      }
      style={{
        minWidth: "80px",
        borderLeft: "1px solid #eee",
        paddingLeft: "15px",
        marginLeft: "15px",
      }}
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
            recommendation.isLiking ? "bi bi-heart-fill" : "bi bi-heart"
          }
        />
      </button>
      <span
        style={{
          fontSize: "1rem",
          color: !isLoggedIn ? "#adb5bd" : "inherit",
        }}
      >
        {recommendation.likesCounter || 0}
      </span>
    </div>
  );

  const MovieInfoSection = ({ movie }: { movie: Movie }) => (
    <div className="movie-info-section d-flex flex-grow-1">
      {/* Poster */}
      <div className="flex-shrink-0 me-3">
        <img
          src={movie.posterUrl}
          alt={`${movie.title} Poster`}
          style={{
            width: "80px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Content */}
      <div className="d-flex flex-column flex-grow-1">
        {/* Title and rating row */}
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ maxWidth: "70%" }}>
            <h6 className="mb-1 text-start">
              {movie.title} (
              {movie.releaseDate
                ? new Date(movie.releaseDate).toLocaleDateString("pl-PL", {
                    year: "numeric",
                  })
                : null}
              )
            </h6>
          </div>

          <div className="d-flex flex-column align-items-end">
            <div>{renderStars(movie.averageScore || 0)}</div>
            <span style={{ fontSize: "1rem" }}>
              {Number(movie.averageScore).toFixed(1)}/5
            </span>
            <p className="mb-0 mt-1" style={{ fontSize: "0.8rem" }}>
              Ilość ocen: {movie.scoresNumber || "0"}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-auto">
          {movie?.categories?.$values?.length ? (
            <div className="d-flex flex-wrap">
              {movie.categories.$values.map((cat) => (
                <div
                  key={cat.name}
                  className="badge me-2 mb-1"
                  style={{
                    backgroundColor: "#2E5077",
                    padding: "5px 10px",
                    color: "white",
                    borderRadius: "15px",
                    fontSize: "0.8rem",
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark mb-0" style={{ fontSize: "0.9rem" }}>
              Brak danych o gatunkach.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0">
      <ul className="list-group w-75 mx-auto">
        {getCombinedData().map(({ movie, recommendation }) => (
          <li
            key={movie.movieId}
            className="list-group-item d-flex p-3 zoomCard"
            onClick={() => handleCardClick(movie)}
            style={{
              borderBottom: "1px solid #ddd",
              minHeight: "150px",
              borderRadius: "15px",
              marginBottom: "5px",
              cursor: "pointer",
            }}
          >
            <div className="d-flex w-100">
              <MovieInfoSection movie={movie} />
              {recommendation && (
                <LikeSection recommendation={recommendation} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendListModule;
