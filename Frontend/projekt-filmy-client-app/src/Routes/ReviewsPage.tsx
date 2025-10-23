import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../models/Review";
import SortReviewModule from "../components/review_components/SortReviewsModle";
import ReviewCard from "../components/review_components/ReviewCard";
import MovieListModule from "../components/SearchMovies_componets/MovieListModule";
import { useParams } from "react-router-dom";
import { useMovieById } from "../API/MovieApi";
import { useReviewsByMovieId, useDeleteReview, useEditReview } from "../API/ReviewApi";
import PaginationModule from "../components/SharedModals/PaginationModule";
import AddReviewModal from "../components/review_components/AddReviewModal";
import { isUserMod } from "../hooks/decodeJWT";
import { useReplyCountsByReviewIds } from "../API/ReplyUniwersalApi"
import SpinnerLoader from "../components/SpinnerLoader";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import ApiErrorDisplay from "../components/ApiErrorDisplay";
import { toast } from "react-toastify";
import { getApiError } from "../functions/getApiError";

const ReviewsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [pagination, setPagination] = useState({ totalItems: 1, pageNumber: 1, pageSize: 2, totalPages: 1 });
  const [sortOrder, setSortOrder] = useState<string>("rating");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [showModal, setShowModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);

  //Api hooks
  const { data: movie, isLoading: movieLoading, error: movieError } = useMovieById(movieId);
  const { data: reviewData, isLoading: reviewsLoading, apiError: reviewsError } = useReviewsByMovieId(
    movieId,
    pagination.pageNumber,
    pagination.pageSize,
    sortOrder,
    sortDirection
  );
  const reviews = reviewData?.reviews ?? [];
  const totalPages = reviewData?.totalPages ?? 1;
  const { data: replyCounts = {}, isLoading: repliesLoading, error: repliesError } = useReplyCountsByReviewIds("Reply", reviews);
  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview} = useDeleteReview();
  const { mutate: editReview, isPending: isEditingReview } = useEditReview();

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

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
    setShowModal(true);
  };

  const handleModalSave = (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      editReview({
        reviewId: reviewToEdit.reviewId,
        updatedReview: { comment: reviewText, rating },
      }, {
        onSuccess: () => {
          setShowModal(false);
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

  const handleSortChange = (category: string) => {
    switch (category) {
      case "highRaiting":
        setSortOrder("rating");
        setSortDirection("desc");
        break;
      case "lowRaiting":
        setSortOrder("rating");
        setSortDirection("asc");
        break;
      case "new":
        setSortOrder("year");
        setSortDirection("desc");
        break;
      case "old":
        setSortOrder("year");
        setSortDirection("asc");
        break;
      default:
        break;
    }
  };

  return (
    <div className="container my-2">
      <div className="m-4">
        <h2 style={{ color: "white" }}>Recenzje filmu:</h2>
        <div style={{ marginTop: "2%", minHeight: "200px" }}>
          {movieLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <SpinnerLoader />
            </div>
          ) : movie ? (
            <MovieListModule movieList={[movie]} />
          ) : (
            <p className="text-light text-center">Nie znaleziono filmu.</p>
          )}
        </div>
      </div>
      {/* Komponent sortowania */}
      <div style={{ marginLeft: "3%" }}>
        <SortReviewModule onSort={handleSortChange} />
      </div>

      {reviewsLoading || repliesLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <SpinnerLoader />
        </div>
      ) : reviewsError ? (
        <ApiErrorDisplay apiError={reviewsError} />
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
            userPage={true}
            onDelete={() => handleDeleteReview(review.reviewId)}
            onEdit={() => handleEditReview(review)}
            commentCount={replyCounts[review.reviewId] ?? 0}
            displayCommentCount={true}
            isLoggedUserMod={isLoggedUserMod}
          />
        ))
      ) : (
        <p>Brak recenzji dla tego filmu.</p>
      )}

      {/* Komponent paginacji */}
      <PaginationModule
        currentPage={pagination.pageNumber}
        totalPages={totalPages}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, pageNumber: page }))
        }
      />

      {reviewToEdit && (
        <AddReviewModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddReview={handleModalSave}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
          headerText={"Edytuj recenzję"} 
          buttonText={"Zapisz zmiany"}
        />
      )}

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
    </div>
  );
};

export default ReviewsPage;
