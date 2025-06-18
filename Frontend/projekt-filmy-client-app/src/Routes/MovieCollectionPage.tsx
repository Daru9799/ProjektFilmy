import { useEffect, useState } from "react";
import { MovieCollection, VisibilityMode } from "../models/MovieCollection";
import { useNavigate, useParams } from "react-router-dom";
import { getLoggedUserId } from "../hooks/decodeJWT";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import {
  addMovieCollectionReview,
  fetchMovieCollectionById,
  fetchMovieCollectionReviews,
} from "../API/movieCollectionApi";
import { Card } from "react-bootstrap";
import "../styles/Zoom.css";
import AddMovieCollectionReviewModal from "../components/review_components/AddMovieCollectionReview";
import { MovieCollectionReview } from "../models/MovieCollectionReview";
import MovieCollectionReviewCard from "../components/review_components/MovieCollectionReviewCard";

const MovieCollectionPage = () => {
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const { id } = useParams();
  const { userName } = useParams();
  const [movieCollection, setMovieCollection] =
    useState<MovieCollection | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [reviewExist, setReviewExist] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviews, setReviews] = useState<MovieCollectionReview[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 99,
    totalPages: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieCollectionById(id, setMovieCollection, setError);
    fetchMovieCollectionReviews(
      id,
      setReviews,
      setError,
      setLoading,
      setPagination,
      null,
      null,
      null,
      pagination.pageSize
    );
  }, [id]);
  useEffect(() => {
    if (id && loggedUserName) {
      const loggedUserId = getLoggedUserId();

      if (!loggedUserId) {
        console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
        setIsLoggedIn(false);
        setReviewExist(false);
        return;
      }

      if (
        reviews.some((user) => user.username === loggedUserName) ||
        movieCollection?.userName === loggedUserName
      ) {
        setReviewExist(true);
      } else {
        setReviewExist(false);
      }
      setIsLoggedIn(true);
    }
  }, [reviews, movieCollection]);

  const handleAddReview = async (
    reviewText: string,
    rating: number,
    isSpoiler: boolean
  ) => {
    try {
      await addMovieCollectionReview(
        reviewText,
        rating,
        isSpoiler,
        loggedUserName,
        movieCollection?.movieCollectionId
      );

      await fetchMovieCollectionById(id, setMovieCollection, setError);
      await fetchMovieCollectionReviews(
        id,
        setReviews,
        setError,
        setLoading,
        setPagination,
        null,
        null,
        null,
        null
      );
    } catch (error: any) {
      console.log("Wystąpił błąd: ", error);
    }
  };

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );
    setIsLoggedIn(true);

    if (id) {
      try {
        await fetchMovieCollectionById(id, setMovieCollection, setError);
      } catch (err) {
        console.error("Błąd podczas odświeżania danych po zalogowaniu:", err);
      }
    }
  };

  const mapShareMode = (value: string): VisibilityMode => {
    switch (value) {
      case "Private":
        return VisibilityMode.Private;
      case "Friends":
        return VisibilityMode.Friends;
      case "Public":
        return VisibilityMode.Public;
      default:
        throw new Error("Unknown share mode: " + value);
    }
  };

  if (movieCollection?.shareMode === "Private" && loggedUserName != userName)
    return <p>Ta kolekcja jest prywatna</p>;
  if (movieCollection?.shareMode === "Friends" && loggedUserName != userName)
    return (
      <p>{`Ta kolekcja jest dostępna tylko dla znajomych użytkownika ${userName}`}</p>
    );
  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className=" container-fluid text-white"
      style={{ marginBottom: "2%", minHeight: "90vh" }}
    >
      <h2 className="mb-4 mt-4" style={{ color: "white" }}>
        {movieCollection?.title}
      </h2>
      {/* Header */}
      <div
        className={`d-flex align-items-center ${
          reviewExist ? "justify-content-center" : "justify-content-between"
        }`}
      >
        <h4 className="mt-3 ms-4" style={{ color: "white" }}>
          Lista utworzona przez użytkownika: {movieCollection?.userName}
        </h4>

        {/* Sprawdza czy użytkownik jest zalogowany, jeżeli tak to sprawdza czy dodał już recenzję
            i odpowiednio chowa/pokazuje przycisk. Jeżeli użytkownik nie jest zalogowany wyświetla
            przcyisk i po wciśnięciu modal do logowania.
        */}
        {isLoggedIn ? (
          !reviewExist && (
            <button
              className="btn btn-outline-light mt-3"
              style={{ width: "200px" }}
              onClick={() => setShowReviewModal(true)}
            >
              Dodaj recenzję
            </button>
          )
        ) : (
          <button
            className="btn btn-outline-light mt-3"
            style={{ width: "200px" }}
            onClick={() => setShowLoginModal(true)}
          >
            Dodaj recenzję
          </button>
        )}
      </div>
      {/*OPIS*/}
      <div className="d-flex justify-content-center mt-4">
        <div
          className="bg-white p-3 shadow-sm"
          style={{
            fontSize: "1.1rem",
            height: "75px",
            overflow: "auto",
            paddingRight: "10px",
            borderRadius: "20px",
            textAlign: "left",
            marginTop: "10px",
            width: "80%",
          }}
        >
          <div className="tab-content">
            <p className="text-dark">
              {movieCollection?.description || "Brak opisu listy."}
            </p>
          </div>
        </div>
      </div>

      {/*TODO - ogarnąć pagincaję */}

      <div className="d-flex justify-content-center">
        <div
          className="mt-4  bg-white p-3 shadow-sm d-flex gap-3 align-items-stretch"
          style={{
            height: "30vh",
            paddingRight: "10px",
            borderRadius: "20px",
            width: "80%",
          }}
        >
          {/*Sprawdza czy kolekcja poprawnie pobrała infomrację o filmach, nastepnie czy w kolekcji znajdują się jakieś filmy i
          wyświetla odpowiedni komunikat */}
          {movieCollection?.movies ? (
            movieCollection.movies.$values.length > 0 ? (
              <div className="d-flex gap-3 align-items-stretch h-100 w-100">
                {movieCollection.movies.$values.slice(0, 5).map((movie) => (
                  <Card
                    key={movie.movieId}
                    className="h-100 zoomCard"
                    style={{ width: "150px", cursor: "pointer" }}
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
                          maxHeight: "2.7rem", // 2 linijki * 1.35rem
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
            <p className="text-dark">Błąd podczas ładownia zawartości listy</p>
          )}
        </div>
      </div>
      <div
        className="container pt-3 text-center"
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <h3 className="mb-4">Recenzje:</h3>

        {reviews.length > 0 ? (
          (console.log(reviews),
          reviews
            .filter((review) => review.spoilers === false)
            .slice(0, 2)
            .map((review) => (
              <MovieCollectionReviewCard
                key={review.movieCollectionReviewId}
                movieCollectionReview={review}
              />
            )))
        ) : (
          <p>Brak recenzji dla tej kolekcji.</p>
        )}
      </div>
      {reviews.length > 2 && id && (
        <button
          className="btn btn-outline-light mb-3"
          onClick={() => navigate(`reviews`)}
        >
          Zobacz wszystkie recenzje
        </button>
      )}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AddMovieCollectionReviewModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onAddReview={handleAddReview}
      />
    </div>
  );
};

export default MovieCollectionPage;
