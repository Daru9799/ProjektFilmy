import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import SortReviewModule from "./SortReviewsModle"; 
import ReviewCard from "./ReviewCard"; 
import MovieListModule from "../SearchMovies_componets/MovieListModule"; 
import { useParams } from "react-router-dom";
import { Movie } from "../../models/Movie"; 
import { deleteReview, editReview, fetchReviewsByMovieId } from "../../API/reviewApi";
import { fetchMovieData } from "../../API/movieApi";
import PaginationModule from "../SharedModals/PaginationModule";
import AddReviewModal from "./AddReviewModal";
import { isUserMod } from "../../hooks/decodeJWT";
import { fetchReplyCountsByReviewIds } from "../../API/ReplyUniwersalAPI";

const ReviewsPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [repliesAmount, setRepliesAmount] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [sortOrder, setSortOrder] = useState<string>("rating"); 
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

const handleDeleteReview = async (reviewId: string) => {
  try {
    await deleteReview(reviewId, setReviews);
    await fetchReviewsByMovieId(
      movieId,
      pagination.pageNumber,
      pagination.pageSize,
      sortOrder,
      sortDirection,
      setReviews,
      setPagination,
      setError
    );
  } catch (err) {
    console.error("Błąd podczas usuwania recenzji:", err);
  }
};

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review); 
    setShowModal(true); 
  };

  const handleModalSave = (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      editReview(
        reviewToEdit.reviewId,
        { comment: reviewText, rating },
        setReviews,
        setError
      );
      setShowModal(false); 
      setReviewToEdit(null); 
    }
  };

  useEffect(() => {
    try{
      fetchReviewsByMovieId(
        movieId,
        pagination.pageNumber,
        pagination.pageSize,
        sortOrder,
        sortDirection,
        setReviews,
        setPagination,
        setError
      );
      fetchMovieData(movieId, setMovie, setError);
    }
    finally{
      setLoading(false);
    }

  }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection, movieId]);

  useEffect(() => {
    try {
      const reviewsListIds = reviews.map((r) => r.reviewId);
      if (reviewsListIds.length > 0) {
        fetchReplyCountsByReviewIds("Reply",reviewsListIds, setRepliesAmount, setError);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania ilości odpowiedzi:", err);
    }
  }, [reviews]);

  const getReplyCountForReview = (reviewId: string) => {
    const index = reviews.findIndex((r) => r.reviewId === reviewId);
    return index !== -1 && repliesAmount[index] !== undefined
      ? repliesAmount[index]
      : 0;
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

  if (loading) {
    return <div className="text-center">Ładowanie recenzji...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-2">
      <div className="m-4">
        <h2 style={{ color: "white" }}>Recenzje filmu:</h2>
        <div style={{ marginTop: "2%" }}>
          {movie && <MovieListModule movieList={movie ? [movie] : []} />}
        </div>
      </div>
      {/* Komponent sortowania */}
      <div style={{ marginLeft: "3%" }}>
        <SortReviewModule onSort={handleSortChange} />
      </div>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
            userPage={true}
            onDelete={() => handleDeleteReview(review.reviewId)}
            onEdit={() => handleEditReview(review)}
            commentCount={getReplyCountForReview(review.reviewId)}
            displayCommentCount = {true}
            isLoggedUserMod={isLoggedUserMod}
          />
        ))
      ) : (
        <p>Brak recenzji dla tego filmu.</p>
      )}

      {/* Komponent paginacji */}
      <PaginationModule
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
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
        />
      )}
    </div>
  );
};

export default ReviewsPage;
