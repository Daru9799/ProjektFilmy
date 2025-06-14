import { useEffect, useState } from "react";
import { MovieCollection } from "../models/MovieCollection";
import { useParams } from "react-router-dom";
import { getLoggedUserId } from "../hooks/decodeJWT";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import { fetchMovieCollectionById } from "../API/movieCollectionApi";

const MovieCollectionPage = () => {
  const userName = localStorage.getItem("logged_username") || "";
  const { id } = useParams();
  const [movieCollection, setMovieCollection] =
    useState<MovieCollection | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [reviewExist, setReviewExist] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(true);

  useEffect(() => {
    fetchMovieCollectionById(id, setMovieCollection, setError, setLoading);
  }, [id]);
  useEffect(() => {
    if (id && userName) {
      const loggedUserId = getLoggedUserId();

      if (!loggedUserId) {
        console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
        setIsLoggedIn(false);
        return;
      }

      if (
        movieCollection?.movieCollectionReviews?.$values.some(
          (user) => user.userName === userName
        ) ||
        movieCollection?.userName === userName
      ) {
        setReviewExist(true);
      } else {
        setReviewExist(false);
      }
      setIsLoggedIn(true);
    }
  }, [movieCollection]);

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );
    setIsLoggedIn(true);

    if (id) {
      try {
        await fetchMovieCollectionById(
          id,
          setMovieCollection,
          setError,
          setLoading
        );
      } catch (err) {
        console.error("Błąd podczas odświeżania danych po zalogowaniu:", err);
      }
    }
  };

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
              //onClick={dodajRecenzjęFunkcja}
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
      <div className="d-flex justify-content-center mt-4">
        <div
          className="bg-white p-3 shadow-sm"
          style={{
            fontSize: "1.1rem",
            height: "100px",
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

      {/*TODO - wyświetlanie filmów + ogarnąć pagincaję */}

      <div className="d-flex justify-content-center">
        <div
          className="mt-4  bg-white p-3 shadow-sm"
          style={{
            height: "20vh",
            paddingRight: "10px",
            borderRadius: "20px",
            width: "80%",
          }}
        >
          <p className="text-dark">Tu będą filmy</p>
        </div>
      </div>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default MovieCollectionPage;
