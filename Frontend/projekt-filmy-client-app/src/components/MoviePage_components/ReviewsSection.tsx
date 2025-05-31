import React from "react";
import { Review } from '../../models/Review';
import ReviewCard from "../review_components/ReviewCard";
import { useNavigate } from "react-router-dom";

interface ReviewsSectionProps {
  reviews: Review[];
  userReview: Review | null;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  movieId: string | undefined;
  totalReviewsCount: number; 
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  userReview,
  onEditReview,
  onDeleteReview,
  movieId,
  totalReviewsCount
}) => {
  const navigate = useNavigate();

  return (
    <>
      {userReview && (
        <div>
          <h3>Twoja recenzja:</h3>
          <ReviewCard
            key={userReview.reviewId}
            review={userReview}
            userRevieForMovie={true}
            onEdit={() => onEditReview(userReview)}
            onDelete={() => onDeleteReview(userReview.reviewId)}
          />
        </div>
      )}

      <div
        className="container pt-3 text-center"
        style={{ marginTop: "10px", marginBottom: "40px" }}
      >
        <h3>Recenzje:</h3>

        {reviews.length > 0 ? (
          reviews
            .slice(0, 2)
            .map((review) => (
              <ReviewCard key={review.reviewId} review={review} />
            ))
        ) : (
          <p>Brak recenzji dla tego filmu.</p>
        )}

      {totalReviewsCount > 2 && movieId && (
        <button 
          className="btn btn-outline-light mt-3"
          onClick={() => navigate(`/${movieId}/reviews`)}
        >
          Zobacz wszystkie recenzje
        </button>
      )}

      </div>
    </>
  );
};

export default ReviewsSection;
