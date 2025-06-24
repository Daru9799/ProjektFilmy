import { Card } from "react-bootstrap";
import { MovieCollection } from "../../models/MovieCollection";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Movie } from "../../models/Movie";
import { fetchMoviesByCollectionId } from "../../API/movieApi";

interface MovieCollectionCardProps {
  movieCollection: MovieCollection | null;
  loggedUserName: string;
  isLoggedUserMod: boolean;
  userPage: boolean;
  isFriend: boolean;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MovieCollectionCard: React.FC<MovieCollectionCardProps> = ({
  movieCollection,
  loggedUserName,
  isLoggedUserMod,
  userPage,
  isFriend,
  setError,
  setLoading,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 99,
    totalPages: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (movieCollection)
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
      className="mt-4 bg-white p-3 shadow-sm d-flex flex-column"
      style={{
        height: userPage ? "350px" : "310px",
        paddingRight: "10px",
        borderRadius: "20px",
        width: "80%",
        margin: "0 auto",
      }}
    >
      {movieCollection?.shareMode === "Private" &&
      movieCollection.userName !== loggedUserName &&
      !isLoggedUserMod ? (
        <h5 className="text-dark mb-1">Prywatne</h5>
      ) : movieCollection?.shareMode === "Friends" &&
        movieCollection.userName !== loggedUserName &&
        !isLoggedUserMod &&
        !isFriend ? (
        <h5 className="text-dark mb-1">Tylko dla znajomych</h5>
      ) : (
        <>
          <div className="d-flex justify-content-center">
            {userPage && (
              <h5
                className="text-dark mb-3"
                style={{ margin: 0, cursor: "pointer", height: "20px" }}
                onClick={() =>
                  navigate(`${movieCollection?.movieCollectionId}`)
                }
              >
                {movieCollection?.title}
              </h5>
            )}
          </div>

          <div style={{ flexGrow: 1, overflowX: "auto" }}>
            {movies ? (
              movies.length > 0 ? (
                <div
                  className="d-flex flex-nowrap gap-3"
                  style={{ minHeight: "100%" }}
                >
                  {movies.map((movie) => (
                    <Card
                      key={movie.movieId}
                      className="zoomCard"
                      style={{
                        height: "100%",
                        width: "150px",
                        cursor: "pointer",
                        flex: "0 0 auto",
                      }}
                      title={movie.title}
                      onClick={() => navigate(`/${movie.movieId}`)}
                    >
                      <Card.Img
                        variant="top"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderTopLeftRadius: "0.375rem",
                          borderTopRightRadius: "0.375rem",
                        }}
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
              <p className="text-dark">
                Błąd podczas ładowania zawartości listy
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieCollectionCard;
