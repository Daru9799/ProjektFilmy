import { useEffect, useState } from "react";
import { MovieCollection } from "../models/MovieCollection";
import { useNavigate, useParams } from "react-router-dom";
import { getLoggedUserId, isUserMod } from "../hooks/decodeJWT";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import { useMovieCollectionById } from "../API/MovieCollectionApi";
import "../styles/Zoom.css";
import AddMovieCollectionReviewModal from "../components/review_components/AddMovieCollectionReview";
import { MovieCollectionReview } from "../models/MovieCollectionReview";
import MovieCollectionReviewCard from "../components/review_components/MovieCollectionReviewCard";
import { sendCollectionReviewedNotification } from "../API/NotificationApi";
import { useAddCollectionReview, useCollectionReviewsByCollectionId, useUserReviewForCollection, useDeleteCollectionReview, useEditCollectionReview } from "../API/CollectionReviewApi";
import MovieCollectionCard from "../components/MovieCollection_components/MovieCollectionCard";
import { fetchRelationsData } from "../API/RelationApi";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";

const MovieCollectionPage = () => {
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const { id } = useParams();
  const { userName } = useParams();
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedOWner, setLoggedOwner] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<any | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<MovieCollectionReview | null>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [relations, setRelations] = useState<any>(null);
  const navigate = useNavigate();
  const loggedUserId = getLoggedUserId();
  
  //Api hooks:
  const { data: movieCollection = null, isLoading: movieCollectionLoading, error: movieCollectionError } = useMovieCollectionById(id);
  const { data: userCollectionReview, isLoading: userReviewLoading, error: userReviewError } = useUserReviewForCollection(loggedUserId, id);
  const { data: collectionReviewsData, isLoading: reviewsLoading, error: reviewsError } = useCollectionReviewsByCollectionId(id, 1, 2, "", "");
  const reviews = collectionReviewsData?.reviews ?? [];
  //Mutacje
  const { mutate: addReview, isPending: isAddingReview, error: addingReviewError } = useAddCollectionReview();
  const { mutate: deleteReview, isPending: isDeletingReview, error: deleteReviewError } = useDeleteCollectionReview();
  const { mutate: editReview, isPending: isEditingReview, error: editError } = useEditCollectionReview();

  //Funkcje
  const onDeleteReview = async (reviewId: string | undefined) => {
    deleteReview(reviewId);
  }

  const onEditReview = (review: MovieCollectionReview | null) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const handleSaveEditedReview = async (reviewText: string, rating: number) => {
    if (!reviewToEdit) return;
    editReview({ reviewId: reviewToEdit.movieCollectionReviewId, updatedReview: { comment: reviewText, rating } }, {
      onSuccess: () => {
        setShowEditModal(false);
        setReviewToEdit(null);
      },
    });
  };

  useEffect(() => {
    if (loggedUserName) {
      fetchRelationsData(
        localStorage.getItem("logged_username")!,
        "",
        setRelations,
        setError,
        navigate
      );
    }
  }, [id]);

  useEffect(() => {
    if (movieCollection && movieCollection?.userName !== userName) {
      navigate("/404"); //jeżeli user w url nie jest właścicielem kolekcji leci na 404
    }

    if (id && loggedUserName) {
      const loggedUserId = getLoggedUserId();

      if (!loggedUserId) {
        console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
        setIsLoggedIn(false);
        return;
      }
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

  const handleAddReview = async (reviewText: string, rating: number, isSpoiler: boolean) => {
    addReview({ comment: reviewText, rating: rating, userName: loggedUserName, movieCollectionId: movieCollection?.movieCollectionId!, spoilers: isSpoiler });
    
    const loggedUserId = getLoggedUserId();
    if (
      movieCollection &&
      loggedUserId &&
      movieCollection.userId !== loggedUserId
    ) {
      await sendCollectionReviewedNotification(
        movieCollection.movieCollectionId,
        movieCollection.userId,
        loggedUserId,
        loggedUserName,
        movieCollection.userName,
        setNotification
      );
    }
  };

  const handleLoginSuccess = async (username: string) => {
    setShowLoginModal(false);
    localStorage.setItem("logged_username", username);
    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: { username } })
    );
    setIsLoggedIn(true);
  };

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
          loggedOWner || userCollectionReview
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
          !loggedOWner && !userCollectionReview ? (
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

      <div className="d-flex justify-content-center mt-4">
        {movieCollectionLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
            <SpinnerLoader />
          </div>
        ) : movieCollection ? (
          <MovieCollectionCard
            movieCollection={movieCollection}
            loggedUserName={loggedUserName}
            isLoggedUserMod={isLoggedUserMod}
            userPage={false}
            isFriend={isFriend}
            setError={setError}
          />
        ) : (
          <p>Nie udało się wczytać kolekcji.</p>
        )}
      </div>

      <div
        className="container pt-3 text-center"
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        {userReviewLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
            <SpinnerLoader />
          </div>
        ) : userCollectionReview ? (
          <div>
            <h3 className="mb-4">Twoja recenzja: </h3>
            <MovieCollectionReviewCard
              key={userCollectionReview.movieCollectionReviewId}
              movieCollectionReview={userCollectionReview}
              userReviewForCollection={true}
              onEdit={() => onEditReview(userCollectionReview)}
              onDelete={() =>
                onDeleteReview(userCollectionReview?.movieCollectionReviewId)
              }
            />
          </div>
        ) : null}

        <h3 className="mb-4">Recenzje:</h3>

        {reviewsLoading ? (
          <SpinnerLoader />
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <MovieCollectionReviewCard
              key={review.movieCollectionReviewId}
              movieCollectionReview={review}
            />
          ))
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

      <ActionPendingModal show={isAddingReview} message="Trwa dodawanie recenzji..."/>
      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
    </div>
  );
};

export default MovieCollectionPage;