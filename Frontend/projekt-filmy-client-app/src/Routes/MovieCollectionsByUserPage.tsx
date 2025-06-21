import PaginationModule from "../components/SharedModals/PaginationModule";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserProfile } from "../models/UserProfile";
import { isUserMod } from "../hooks/decodeJWT";
import { fetchUserData } from "../API/userAPI";
import { fetchMovieCollectionsByUser } from "../API/movieCollectionApi";
import { MovieCollection } from "../models/MovieCollection";
import { Card } from "react-bootstrap";

const MovieCollectionByUserPage = () => {
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [user, setUser] = useState<UserProfile>();
  const { userName } = useParams();
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fakeLoading, fakeSetLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>("likes");
  const [sortDirection, setSortDirection] = useState<string>("likes");
  const [movieCollections, setMovieCollections] = useState<MovieCollection[]>(
    []
  );
  const placeholder = () => {};
  const navigate = useNavigate();
  const collectionNavigate = useNavigate();

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  useEffect(() => {
    fetchUserData(userName, setUser, setError, fakeSetLoading, placeholder);
  }, [userName]);

  useEffect(() => {
    if (user?.id) {
      fetchMovieCollectionsByUser(
        user.id,
        pagination.pageNumber,
        pagination.pageSize,
        sortOrder,
        sortDirection,
        setMovieCollections,
        setPagination,
        setError,
        setLoading
      );
    }
  }, [user, pagination.pageNumber, pagination.pageSize]);

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="mt-3">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>

      <h4 className=" ms-4" style={{ color: "white" }}>
        Kolekcje użytkownika {user?.userName}
      </h4>

      {/*////////////////////////////////////////////////////////////////////////////////
      // Do przerzucenia do osobnego modułu
      // */}
      {movieCollections.map((movieCollection) => (
        <div
          style={{ cursor: "pointer" }}
          key={movieCollection.movieCollectionId}
          className="d-flex justify-content-center zoomCard"
          onClick={() => {
            collectionNavigate(`${movieCollection.movieCollectionId}`);
          }}
        >
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
                  <h5 className="text-dark mb-1" style={{ margin: 0 }}>
                    {movieCollection.title}
                  </h5>
                </div>

                {movieCollection?.movies ? (
                  movieCollection.movies.$values.length > 0 ? (
                    <div className="d-flex gap-3 align-items-stretch h-100 w-100">
                      {movieCollection.movies.$values
                        .slice(0, 5)
                        .map((movie) => (
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
                  <p className="text-dark">
                    Błąd podczas ładowania zawartości listy
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      ))}

      {/*////////////////////////////////////////////////////////////////////////////////*/}

      <div className="mt-3">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

export default MovieCollectionByUserPage;
