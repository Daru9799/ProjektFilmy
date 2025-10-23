import ImageModal from "../components/SharedModals/ImageModal";
import MovieTabs from "../components/MoviePage_components/MovieTabs";
import ReviewsSection from "../components/MoviePage_components/ReviewsSection";
import AddReviewModal from "../components/review_components/AddReviewModal";
import MovieHeader from "../components/MoviePage_components/MovieHeader";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import { useMoviePageLogic } from "../hooks/useMoviePageLogic";
import RecommendMovieModule from "../components/MoviePage_components/RecommendMovieModule";
import { useMovieById, useActorsByMovieId, useCheckIfInPlanned, useCheckIfInWatched, useAddToWatched, useAddToPlanned, useDeleteFromPlanned, useDeleteFromWatched  } from "../API/MovieApi";
import { useAddReview, useDeleteReview, useEditReview, useReviewsByMovieId, useUserReviewForMovie } from "../API/ReviewApi";
import { useParams } from "react-router-dom";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import { useState } from "react";
import { Review } from "../models/Review";
import { useAddFollowMovie, useIsFollowingMovie, useRemoveFollowMovie } from "../API/UserApi";
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import { toast } from "react-toastify";
import { getApiError } from "../functions/getApiError";

const MoviePage = () => {
  const { movieId } = useParams();
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { showReviewModal, showLoginModal, isLoggedIn, setShowReviewModal, setShowLoginModal, handleLoginSuccess } = useMoviePageLogic();
  //Api hooks
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieById(movieId);
  const { data: people, isLoading: peopleLoading, error: peopleError } = useActorsByMovieId(movieId);
  const { data: userReview, isLoading: userReviewLoading } = useUserReviewForMovie(loggedUserName, movieId);
  const { data: isFollowingMovie = false, isLoading: isFollowingMovieLoading, error: isFollowingMovieError } = useIsFollowingMovie(movieId);
  const { data: isPlanned, isLoading: loadingPlanned, error: errorPlanned } = useCheckIfInPlanned(movieId);
  const { data: isWatched, isLoading: loadingWatched, error: errorWatched } = useCheckIfInWatched(movieId);
  const { data: reviewData, isLoading: reviewsLoading, apiError: reviewsError } = useReviewsByMovieId(movieId, 1, 2, "", "");
  const reviews = reviewData?.reviews ?? [];
  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview } = useDeleteReview();
  const { mutate: editReview, isPending: isEditingReview } = useEditReview();
  const { mutate: addReview, isPending: isAddingReview } = useAddReview();
  const { mutate: addFollowMovie, isPending: addingFollowMovie, error: addFollowMovieError } = useAddFollowMovie();
  const { mutate: removeFollowMovie, isPending: removingFollowMovie, error: removeFollowMovieError } = useRemoveFollowMovie();
  const { mutate: addToPlanned, isPending: addingPlanned, error: addToPlannedError } = useAddToPlanned();
  const { mutate: deleteFromPlanned, isPending: deletingPlanned } = useDeleteFromPlanned();
  const { mutate: addToWatched, isPending: addingWatched, error: addToWatchedError } = useAddToWatched();
  const { mutate: deleteFromWatched, isPending: deletingWatched } = useDeleteFromWatched();

  //Funkcje
  const handleDeleteReview = async (reviewId: string) => {
    deleteReview(reviewId, {
      onSuccess: () => {
        toast.success("Recenzja została usunięta pomyślnie!");
      },
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się usunąć recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    setShowEditModal(true);
  };

  const handleSaveEditedReview = (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      editReview({
        reviewId: reviewToEdit.reviewId,
        updatedReview: { comment: reviewText, rating },
      }, {
        onSuccess: () => {
          setShowEditModal(false);
          setReviewToEdit(null);
          toast.success("Recenzja została zaktualizowana pomyślnie!");
        },
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się zaktualizować recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
        },
      });
    }
  };

  const handleAddReview = (review: string, rating: number) => {
    if (!movieId || !loggedUserName) return;
    addReview({ rating, comment: review, movieId, userName: loggedUserName }, {
        onSuccess: () => {
          setShowReviewModal(false);
          toast.success("Recenzja została dodana pomyślnie!");
        },
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się dodać recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`
          );
        },
      }
    );
  };

  const handleChangeFollowing = async () => {
    if(!movieId) return
    if (isFollowingMovie === false) {
        addFollowMovie(movieId);
        console.log("Film dodany do obserwowanych!");
    } else {
        removeFollowMovie(movieId);
        console.log("Film usunuęty obserwowanych!");
    }
  };

  const handleChangePlanned = () => {
    if (isPlanned) deleteFromPlanned(movieId!);
    else addToPlanned(movieId!);
  };

  const handleChangeWatched = () => {
    if (isWatched) deleteFromWatched(movieId!);
    else addToWatched(movieId!);
  };
  
  if (movieLoading || peopleLoading || reviewsLoading || userReviewLoading || isFollowingMovieLoading || loadingPlanned || loadingWatched) return <SpinnerLoader />;

  if (!movie) return <p>Nie znaleziono filmu.</p>; //Tymczasowe rozwiązanie zeby nie przeszkadzalo w debbugowaniu

  return (
    <div
      className="container-fluid text-white"
      style={{ left: "200px", minHeight: "90vh" }}
    >
      <div className="row my-4">
        <div className="col-3 text-center p-2">
          <ImageModal
            imageUrl={movie?.posterUrl}
            altText="Poster"
            defaultImageUrl="/path/to/defaultPoster.jpg"
          />
        </div>
        <div className="col-9">
          <MovieHeader
            movie={movie}
            isLoggedIn={isLoggedIn}
            showReviewModal={showReviewModal}
            setShowReviewModal={setShowReviewModal}
            showLoginModal={showLoginModal}
            setShowLoginModal={setShowLoginModal}
            handleAddReview={handleAddReview}
            handleLoginSuccess={handleLoginSuccess}
            userReview={userReview ?? null}
            isFollowing={isFollowingMovie}
            handleChangeFollowing={handleChangeFollowing}
            inList={isPlanned ? "Planowany" : isWatched ? "Obejrzany" : null}
            handleChangePlanned={(handleChangePlanned)}
            handleChangeWatched={handleChangeWatched}
          />

          <MovieTabs movie={movie} people={people ?? []} />
        </div>
      </div>

      <RecommendMovieModule movieId={movie?.movieId} />

      {reviewToEdit && (
        <AddReviewModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onAddReview={handleSaveEditedReview}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
          headerText={"Edytuj recenzję"} 
          buttonText={"Zapisz zmiany"}
        />
      )}

      {reviewsError ? (
        <ApiErrorDisplay apiError={reviewsError} />
      ) : (
        <ReviewsSection
          reviews={reviews}
          userReview={userReview ?? null}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
          movieId={movie?.movieId}
          totalReviewsCount={movie?.reviewsNumber ?? 0}
        />
      )}

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
      <ActionPendingModal show={isAddingReview} message="Trwa dodawanie recenzji..." />
      <ActionPendingModal show={addingFollowMovie} message="Trwa dodawanie filmu do obserwowanych..." />
      <ActionPendingModal show={removingFollowMovie} message="Trwa usuwanie filmu z obserwowanych..." />
      <ActionPendingModal show={addingPlanned} message="Trwa dodawanie filmu do planowanych..." />
      <ActionPendingModal show={addingWatched} message="Trwa dodawanie filmu do obejrzanych..." />
      <ActionPendingModal show={deletingPlanned} message="Trwa usuwanie filmu z planowanych..." />
      <ActionPendingModal show={deletingWatched} message="Trwa usuwanie filmu z obejrzanych..." />
    </div>
  );
};

export default MoviePage;