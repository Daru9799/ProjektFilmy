import { Card } from "react-bootstrap";
import { MovieCollection } from "../../models/MovieCollection";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Movie } from "../../models/Movie";
import { fetchMoviesByCollectionId } from "../../API/movieApi";

interface MovieCollectionCardProps {
  movieCollection: MovieCollection;
  loggedUserName: string;
  isLoggedUserMod: boolean;
  userPage: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MovieCollectionCard: React.FC<MovieCollectionCardProps> = ({
  movieCollection,
  loggedUserName,
  isLoggedUserMod,
  userPage,
  setError,
  setLoading,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetchMoviesByCollectionId(
        movieCollection.movieCollectionId,
        pagination.pageNumber,
        pagination.pageSize,
        setMovies,
        setError,
        setLoading,
        setPagination
      );
    } catch (err: any) {
      console.log(err);
    }
  }, [movieCollection]);

  return (
    <div
      className="mt-4 bg-white p-3 shadow-sm gap-3"
      style={{
        height: "32vh",
        paddingRight: "10px",
        borderRadius: "20px",
        width: "80%",
      }}
    >
      {" "}
      {movieCollection.shareMode === "Private" &&
      movieCollection.userName !== loggedUserName &&
      !isLoggedUserMod ? (
        <h5 className="text-dark mb-1">Prywatne</h5>
      ) : movieCollection.shareMode === "Friends" &&
        movieCollection.userName !== loggedUserName &&
        !isLoggedUserMod ? (
        <h5 className="text-dark mb-1">Tylko dla znajomych</h5>
      ) : (
        <>
          <div
            style={{ width: "100%" }}
            className="d-flex justify-content-center"
          >
            {userPage && (
              <h5
                className="text-dark mb-3"
                style={{ margin: 0, cursor: "pointer" }}
                onClick={() => navigate(`${movieCollection.movieCollectionId}`)}
              >
                {movieCollection.title}
              </h5>
            )}
          </div>

          {movies ? (
            movies.length > 0 ? (
              <div className="d-flex gap-3 align-items-stretch h-100 w-100">
                {movies.slice(0, 5).map((movie) => (
                  <Card
                    key={movie.movieId}
                    className="zoomCard"
                    style={{
                      height: "90%",
                      width: "150px",
                      cursor: "pointer",
                    }}
                    title={movie.title}
                    onClick={() => navigate(`/${movie.movieId}`)}
                  >
                    <Card.Img
                      variant="top"
                      style={{ height: "80%", objectFit: "cover" }}
                      src={movie.posterUrl}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Card.Text
                        className="text-center"
                        style={{
                          fontSize: "0.9rem",
                          maxHeight: "2.7rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {movie.title}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-dark">Brak filmów do wyświetlenia</p>
            )
          ) : (
            <p className="text-dark">Błąd podczas ładowania zawartości listy</p>
          )}
        </>
      )}
    </div>
  );
};

export default MovieCollectionCard;
