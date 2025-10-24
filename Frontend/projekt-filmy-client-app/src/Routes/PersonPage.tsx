import { useState } from "react";
import { useParams } from "react-router-dom";
import ImageModal from "../components/SharedModals/ImageModal";
import { usePersonById, usePersonMovies } from "../API/PersonApi";
import MovieListModule from "../components/SearchMovies_componets/MovieListModule";
import { useAddFollowPerson, useIsFollowingPerson, useRemoveFollowPerson } from "../API/UserApi";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import { toast } from "react-toastify";
import { getApiError } from "../functions/getApiError";

const PersonPage = () => {
  const userName = localStorage.getItem("logged_username") || "";
  const { id } = useParams();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  //API hook
  const { data: person, isLoading: personLoading, apiError: personError } = usePersonById(id);
  const { data: isFollowingPerson = false } = useIsFollowingPerson(id);
  const { data: moviesData, isLoading: moviesLoading, apiError: moviesError } = usePersonMovies(id);
  const movies = moviesData ?? [];
  //Mutacje
  const { mutate: addFollowPerson, isPending: addingFollowPerson } = useAddFollowPerson();
  const { mutate: removeFollowPerson, isPending: removingFollowPerson } = useRemoveFollowPerson();

  const isLogged = !!userName;

  const handleChangeFollowing = () => {
    if (!id) return;
    if (isFollowingPerson) {
      removeFollowPerson(id, {
        onSuccess: () => {
          toast.success("Przestałeś obserwować tę osobę!");
        },
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się przestać obserwować osoby. [${apiErr?.statusCode}] ${apiErr?.message}`);
        },
      });
    } else {
      addFollowPerson(id, {
        onSuccess: () => {
          toast.success("Rozpocząłeś obserwację tej osoby!");
        },
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się rozpocząć obserwacji osoby. [${apiErr?.statusCode}] ${apiErr?.message}`);
        },
      });
    }
  };

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );
    setShowLoginModal(false);
  };

  if (personLoading) return <SpinnerLoader />;

  if(personError) return <ApiErrorDisplay apiError={personError} />

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
                  backgroundColor: !isFollowingPerson ? "green" : "red",
                  width: "200px",
                }}
                onClick={handleChangeFollowing}
              >
                {!isFollowingPerson ? "Obserwuj" : "Przestań obserwować"}
              </button>
            ) : (
              <button
                className="btn btn-outline-light mt-3"
                style={{
                  backgroundColor: !isFollowingPerson ? "green" : "red",
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
            <span className="fw-bold">Najczęściej udziela się w: </span>
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

      {moviesLoading ? (
        <SpinnerLoader />
      ) : moviesError ? (
        <ApiErrorDisplay apiError={moviesError} />
      ) : movies.length > 0 ? (
        <>
          <p style={{ fontSize: "1.6rem", marginTop: "5%" }}>
            {movies.length === 1 ? "Powiązany film:" : "Powiązane filmy:"}
          </p>
          <MovieListModule movieList={movies} />
        </>
      ) : (
        <p>Brak powiązanych filmów.</p>
      )}

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <ActionPendingModal show={addingFollowPerson} message="Trwa dodawanie filmu do obserwowanych..." />
      <ActionPendingModal show={removingFollowPerson} message="Trwa usuwanie filmu z obserwowanych..." />
    </div>
  );
};

export default PersonPage;
