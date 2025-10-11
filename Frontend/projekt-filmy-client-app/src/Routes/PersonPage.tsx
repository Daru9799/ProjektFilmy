import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageModal from "../components/SharedModals/ImageModal";
import { usePersonById, usePersonMovies } from "../API/PersonApi";
import MovieListModule from "../components/SearchMovies_componets/MovieListModule";
import { getLoggedUserId } from "../hooks/decodeJWT";
import { addFollowPerson, removeFollowPerson } from "../API/userAPI";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import axios from "axios";
import SpinnerLoader from "../components/SpinnerLoader";

const PersonPage = () => {
  const userName = localStorage.getItem("logged_username") || "";
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  //API hook
  const { data: person, isLoading: personLoading, error: personError } = usePersonById(id);
  const { data: moviesData, isLoading: moviesLoading } = usePersonMovies(id);
  const movies = moviesData ?? [];

  useEffect(() => {
    if (id && userName) {
      const loggedUserId = getLoggedUserId();

      if (!loggedUserId) {
        console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
        setIsLogged(false);
        return;
      }

      checkFollowing(id);
      setIsLogged(true);
    }
  }, [person]);

  console.log(isLogged);
  const handleChangeFollowing = async () => {
    if (isFollowing === false) {
      try {
        const data = await addFollowPerson(person?.personId);
        console.log("Odpowiedz: ", data);
        setIsFollowing(true);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    } else {
      try {
        const data = await removeFollowPerson(person?.personId);
        console.log("Odpowiedz: ", data);
        setIsFollowing(false);
      } catch (error: any) {
        console.error(error);
        setError(error);
      }
    }
  };

  const checkFollowing = async (personId: string) => {
    try {
      const response = await axios.get(
        `https://localhost:7053/api/Users/get-follow-person/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Odpowiedź: " + response.data);

      if (response.data === true) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Błąd po stronie sieci/axios:", err);
    }
  };

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );
    setIsLogged(true);

    if (id) {
      try {
        checkFollowing(id);
      } catch (err) {
        console.error("Błąd podczas odświeżania danych po zalogowaniu:", err);
      }
    }
  };

  if (personLoading || moviesLoading) return <SpinnerLoader />;
  
  if (error) return <p>{error}</p>;

  return (
    <div
      className=" container-fluid text-white"
      style={{ marginBottom: "2%", minHeight: "90vh" }}
    >
      <div className="row my-4">
        {/* Left Column (Poster) */}
        <div className="col-3">
          <div className="p-2 text-center">
            {/* Użycie ImageModal */}
            <ImageModal
              imageUrl={person?.photoUrl}
              altText={`${person?.firstName} ${person?.lastName} Poster`}
              defaultImageUrl="/path/to/defaultPoster.jpg"
            />
          </div>
        </div>

        <div
          className="col-8"
          style={{ textAlign: "left", marginLeft: "50px", marginTop: "20px" }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <h2 className="mb-0" style={{ fontSize: "4rem" }}>
              {person?.firstName && person?.lastName
                ? `${person.firstName} ${person.lastName}`
                : "Imię i nazwisko niedostępne"}
            </h2>
            {/* Przycisk do obserwowania */}
            {isLogged ? (
              <button
                className="btn btn-outline-light mt-3"
                style={{
                  backgroundColor: !isFollowing ? "green" : "red",
                  width: "200px",
                }}
                onClick={handleChangeFollowing}
              >
                {!isFollowing ? "Obserwuj" : "Przestań obserwować"}
              </button>
            ) : (
              <button
                className="btn btn-outline-light mt-3"
                style={{
                  backgroundColor: !isFollowing ? "green" : "red",
                  width: "200px",
                }}
                onClick={() => setShowLoginModal(true)}
              >
                Obserwuj
              </button>
            )}
          </div>

          {/* Data urodzenia */}
          <p style={{ marginTop: "50px" }}>
            <span className="fw-bold">Data urodzenia: </span>
            {person?.birthDate
              ? new Date(person.birthDate).toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Brak danych"}
          </p>
          <p style={{ marginTop: "10px" }}>
            <span className="fw-bold">Liczba wszystkich filmów: </span>
            {person?.totalMovies ? `${person.totalMovies}` : "Niedostępna"}
          </p>
          <p style={{ marginTop: "10px" }}>
            <span className="fw-bold">Najczęściej kręci: </span>
            {person?.favoriteGenre ? `${person.favoriteGenre}` : "Niedostępny"}
          </p>

          {/* Biografia */}
          <div
            className="bg-white p-3 shadow-sm"
            style={{
              fontSize: "1.1rem",
              minHeight: "140px",
              borderRadius: "20px",
              textAlign: "left",
              marginTop: "20px",
              marginRight: "50px",
            }}
          >
            <p className="text-dark">
              {person?.bio || "Brak danych o biografii."}
            </p>
          </div>
        </div>
      </div>

      {movies.length > 0 && (
        <p style={{ fontSize: "1.6rem", marginTop: "5%" }}>
          {movies.length === 1 ? "Powiązany film:" : "Powiązane filmy:"}
        </p>
      )}

      <MovieListModule movieList={movies} />

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default PersonPage;
