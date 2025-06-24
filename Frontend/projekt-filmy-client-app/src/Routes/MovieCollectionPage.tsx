import { useEffect, useState } from "react";
import { MovieCollection } from "../models/MovieCollection";
import { useNavigate, useParams } from "react-router-dom";
import { getLoggedUserId, isUserMod } from "../hooks/decodeJWT";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import {
  addMovieCollectionReview,
  fetchMovieCollectionById,
  fetchMovieCollectionReviews,
  fetchUserReviewForMC,
} from "../API/movieCollectionApi";
import "../styles/Zoom.css";
import AddMovieCollectionReviewModal from "../components/review_components/AddMovieCollectionReview";
import { MovieCollectionReview } from "../models/MovieCollectionReview";
import MovieCollectionReviewCard from "../components/review_components/MovieCollectionReviewCard";
import { sendCollectionReviewedNotification } from "../API/notificationApi";
import { deleteReviewMC, editReviewMC } from "../API/CollectionReviewAPI";
import MovieCollectionCard from "../components/MovieCollection_components/MovieCollectionCard";
import { fetchRelationsData } from "../API/relationApi";

const MovieCollectionPage = () => {
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const { id } = useParams();
  const { userName } = useParams();
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [movieCollection, setMovieCollection] =
    useState<MovieCollection | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedOWner, setLoggedOwner] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviews, setReviews] = useState<MovieCollectionReview[]>([]);
  const [notification, setNotification] = useState<any | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 2,
    totalPages: 1,
  });
  const [userReview, setUserReview] = useState<MovieCollectionReview | null>(
    null
  );
  const [reviewToEdit, setReviewToEdit] =
    useState<MovieCollectionReview | null>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [moviesLoading, setMoviesLoading] = useState<boolean>(true);
  const [relations, setRelations] = useState<any>(null);

  const navigate = useNavigate();

  const onEditReview = (review: MovieCollectionReview | null) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const onDeleteReview = async (reviewId: string | undefined) => {
    try {
      await deleteReviewMC(reviewId, setReviews);
      setUserReview(null);
      if (id) {
        await fetchMovieCollectionReviews(
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
        fetchMovieCollectionById(id, setMovieCollection, setError);
      }
    } catch (err) {
      console.error("Błąd podczas usuwania recenzji:", err);
    }
  };

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      const loggedUserId = getLoggedUserId();
      try {
        await editReviewMC(
          reviewToEdit.movieCollectionReviewId,
          { comment: reviewText, rating },
          setReviews,
          setError
        );
        if (id && loggedUserId) {
          await fetchMovieCollectionReviews(
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

          fetchMovieCollectionById(id, setMovieCollection, setError);
          fetchUserReviewForMC(loggedUserId, id, setUserReview, setError);
        }
      } catch (err) {
        console.error("Błąd podczas edycji recenzji:", err);
        setError("Nie udało się edytować recenzji.");
      } finally {
        setShowEditModal(false);
        setReviewToEdit(null);
      }
    }
  };

  useEffect(() => {
    fetchRelationsData(
      localStorage.getItem("logged_username")!,
      "",
      setRelations,
      setError,
      navigate
    );
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
        return;
      }
      fetchUserReviewForMC(loggedUserId, id, setUserReview, setError);
      setIsLoggedIn(true);
      setLoggedOwner(movieCollection?.userId === loggedUserId);
    }
  }, [reviews, movieCollection]);

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  const isFriend = relations?.$values.some(
    (relation: any) =>
      relation.type === "Friend" && relation.relatedUserName === userName
  );
  const isBlocked = relations?.$values.some(
    (relation: any) =>
      relation.type === "Blocked" && relation.relatedUserName === userName
  );

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

      // const loggedUserId = getLoggedUserId();
      // if (
      //   movieCollection &&
      //   loggedUserId &&
      //   movieCollection.userId !== loggedUserId
      // ) {
      //   await sendCollectionReviewedNotification(
      //     movieCollection.movieCollectionId,
      //     movieCollection.userId,
      //     loggedUserId,
      //     loggedUserName,
      //     movieCollection.userName,
      //     setNotification
      //   );
      // }

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

  if (movieCollection?.userName !== userName) {
    navigate("/404"); //jeżeli user w url nie jest właścicielem kolekcji leci na 404
    return null;
  }

  if (isBlocked) {
    navigate("/"); //W przypadku bloka przenosi na /
    return null;
  }

  if (
    movieCollection?.shareMode === "Private" &&
    loggedUserName != userName &&
    !isLoggedUserMod
  )
    return <p>Ta kolekcja jest prywatna</p>;
  if (
    movieCollection?.shareMode === "Friends" &&
    loggedUserName != userName &&
    !isLoggedUserMod &&
    !isFriend
  )
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
          loggedOWner || userReview
            ? "justify-content-center"
            : "justify-content-between"
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
          !loggedOWner && !userReview ? (
            <button
              className="btn btn-outline-light mt-3"
              style={{ width: "200px" }}
              onClick={() => setShowReviewModal(true)}
            >
              Dodaj recenzję
            </button>
          ) : null
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

      <MovieCollectionCard
        movieCollection={movieCollection}
        loggedUserName={loggedUserName}
        isLoggedUserMod={isLoggedUserMod}
        userPage={false}
        isFriend={isFriend}
        setError={setError}
        setLoading={setMoviesLoading}
      />
      <div
        className="container pt-3 text-center"
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        {userReview && (
          <div>
            <h3 className="mb-4">Twoja recenzja: </h3>
            <MovieCollectionReviewCard
              key={userReview.movieCollectionReviewId}
              movieCollectionReview={userReview}
              userReviewForCollection={true}
              onEdit={() => onEditReview(userReview)}
              onDelete={() =>
                onDeleteReview(userReview?.movieCollectionReviewId)
              }
            />
          </div>
        )}

        <h3 className="mb-4">Recenzje:</h3>

        {reviews.length > 0 ? (
          (console.log(reviews),
          reviews.map((review) => (
            <MovieCollectionReviewCard
              key={review.movieCollectionReviewId}
              movieCollectionReview={review}
            />
          )))
        ) : (
          <p>Brak recenzji dla tej kolekcji.</p>
        )}
      </div>
      {reviews.length === 2 && id && (
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

      {reviewToEdit && (
        <AddMovieCollectionReviewModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onAddReview={handleSaveEditedReview}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
        />
      )}
    </div>
  );
};

export default MovieCollectionPage;
