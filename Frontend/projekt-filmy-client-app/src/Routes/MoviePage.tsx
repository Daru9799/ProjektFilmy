import ImageModal from "../components/SharedModals/ImageModal";
import MovieTabs from "../components/MoviePage_components/MovieTabs";
import ReviewsSection from "../components/MoviePage_components/ReviewsSection";
import AddReviewModal from "../components/review_components/AddReviewModal";
import MovieHeader from "../components/MoviePage_components/MovieHeader";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import { useMoviePageLogic } from "../hooks/useMoviePageLogic";
import RecommendMovieModule from "../components/MoviePage_components/RecommendMovieModule";
import { useMovieById, useActorsByMovieId  } from "../API/movieApi";
import { useAddReview, useDeleteReview, useEditReview, useReviewsByMovieId, useUserReviewForMovie } from "../API/ReviewApi";
import { useParams } from "react-router-dom";
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import { useState } from "react";
import { Review } from "../models/Review";

const MoviePage = () => {
  const {
    showReviewModal,
    showLoginModal,
    loading,
    error,
    isLoggedIn,
    isFollowing,
    inList,
    setShowReviewModal,
    setShowLoginModal,
    setIsFollowing,
    handleLoginSuccess,
    handleChangeFollowing,
    setInList,
    handleChangePlanned,
    handleChangeWatched,
  } = useMoviePageLogic();

  ///////////Tutaj zaczynamy
  const { movieId } = useParams();
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  //Api hooks
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieById(movieId);
  const { data: people, isLoading: peopleLoading, error: peopleError } = useActorsByMovieId(movieId);
  const { data: userReview, isLoading: userReviewLoading, error: userReviewError } = useUserReviewForMovie(loggedUserName, movieId);
  const { data: reviewData, isLoading: reviewsLoading, error: reviewsError } = useReviewsByMovieId(movieId, 1, 2, "", "");
  const reviews = reviewData?.reviews ?? [];
  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview, error: deleteReviewError } = useDeleteReview();
  const { mutate: editReview, isPending: isEditingReview, error: editError } = useEditReview();
  const { mutate: addReview, isPending: isAddingReview, error: addError } = useAddReview();

  //Funkcje
  const handleDeleteReview = async (reviewId: string) => {
    deleteReview(reviewId)
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
      });
      setShowEditModal(false);
      setReviewToEdit(null);
    }
  };

  const handleAddReview = (review: string, rating: number) => {
    if (!movieId || !loggedUserName) return;
    addReview({ rating, comment: review, movieId, userName: loggedUserName }, 
      {
        onSuccess: () => {
          setShowReviewModal(false);
        },
        onError: (error) => {
          console.error("Błąd podczas dodawania recenzji:", error); //ERROR HANDLING BY SIE PRZYDAL
        },
      }
    );
  };
  
  if (movieLoading || peopleLoading || reviewsLoading || userReviewLoading) return <SpinnerLoader />;

  if (!movie) return <p>Nie znaleziono filmu.</p>; //Tymczasowe rozwiązanie zeby nie przeszkadzalo w debbugowaniu

  if (error) return <p>{error}</p>;

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
            isFollowing={isFollowing}
            handleChangeFollowing={handleChangeFollowing}
            inList={inList}
            setInList={setInList}
            handleChangePlanned={handleChangePlanned}
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
        />
      )}

      <ReviewsSection
        reviews={reviews}
        userReview={userReview ?? null}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
        movieId={movie?.movieId}
        totalReviewsCount={movie?.reviewsNumber ?? 0}
      />

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
      <ActionPendingModal show={isAddingReview} message="Trwa dodawanie recenzji..." />
    </div>
  );
};

export default MoviePage;
