import ImageModal from "../components/SharedModals/ImageModal";
import MovieTabs from "../components/MoviePage_components/MovieTabs";
import ReviewsSection from "../components/MoviePage_components/ReviewsSection";
import AddReviewModal from "../components/review_components/AddReviewModal";
import MovieHeader from "../components/MoviePage_components/MovieHeader";
import LoginModal from "../components/SingIn_SignUp_componets/LoginModal";
import { useMoviePageLogic } from "../hooks/useMoviePageLogic";
import RecommendMovieModule from "../components/MoviePage_components/RecommendMovieModule";
import { useMovieById, useActorsByMovieId  } from "../API/movieApi";
import { useParams } from "react-router-dom";
import SpinnerLoader from "../components/SpinnerLoader";

const MoviePage = () => {
  const {
    reviews,
    userReview,
    reviewToEdit,
    showEditModal,
    showReviewModal,
    showLoginModal,
    loading,
    error,
    isLoggedIn,
    isFollowing,
    inList,
    setShowReviewModal,
    setShowLoginModal,
    setShowEditModal,
    setIsFollowing,
    handleEditReview,
    handleDeleteReview,
    handleAddReview,
    handleLoginSuccess,
    handleSaveEditedReview,
    handleChangeFollowing,
    setInList,
    handleChangePlanned,
    handleChangeWatched,
  } = useMoviePageLogic();

  ///////////Tutaj zaczynamy
  const { movieId } = useParams();
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieById(movieId);
  const { data: people, isLoading: peopleLoading, error: peopleError } = useActorsByMovieId(movieId);
  
  if (movieLoading || peopleLoading) return <SpinnerLoader />;

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
            userReview={userReview}
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
