import ImageModal from "../../hooks/ImageModal";
import MovieTabs from "./MovieTabs";
import ReviewsSection from "./ReviewsSection";
import AddReviewModal from "../review_components/AddReviewPanel";
import MovieHeader from "./MovieHeader";
import LoginModal from "../SingIn_SignUp_componets/LoginModal";
import { useMoviePageLogic } from "../../hooks/useMoviePageLogic";

const MoviePage = () => {
  const {
    movie,
    people,
    reviews,
    userReview,
    reviewToEdit,
    showEditModal,
    showReviewModal,
    showLoginModal,
    loading,
    error,
    isLoggedIn,
    setShowReviewModal,
    setShowLoginModal,
    setShowEditModal,
    handleEditReview,
    handleDeleteReview,
    handleAddReview,
    handleLoginSuccess,
    handleSaveEditedReview,
  } = useMoviePageLogic();

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid text-white" style={{ left: "200px", minHeight: "90vh" }}>
      <div className="row my-4">
        <div className="col-3 text-center p-2">
          <ImageModal imageUrl={movie?.posterUrl} altText="Poster" defaultImageUrl="/path/to/defaultPoster.jpg" />
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
          userReview={userReview}
        />

          <MovieTabs movie={movie} people={people} />
        </div>
      </div>

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
        userReview={userReview}
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
    </div>
  );
};

export default MoviePage;
