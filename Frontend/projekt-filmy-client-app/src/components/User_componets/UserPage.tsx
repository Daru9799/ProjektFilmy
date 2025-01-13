import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import { fetchUserData, fetchUserReviews, deleteReview, editReview } from "../../functions/ReloadFunctions";
import "./UserPage.css";
import ReviewCard from "../review_components/ReviewCard";
import AddReviewModal from "../review_components/AddReviewPanel";
import EditUserModal from "./EditUserModal";

function getUserRoleName(role: userRole): string {
  switch (role) {
    case userRole.user:
      return "Normalny użytkownik";
    case userRole.critic:
      return "Krytyk";
    case userRole.mod:
      return "Moderator";
    default:
      return "Nieznany";
  }
}

const UserPage = () => {
  const { userName } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userName) {
      fetchUserData(userName, setUser, setError, setLoading);
      fetchUserReviews(userName, 3, setReviews, setError);
    }
    console.log("Czy użytkownik jest właścicielem?", user?.isOwner);
  }, [userName]);

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId, setReviews);
    if (userName) {
      fetchUserData(userName, setUser, setError, setLoading);
      fetchUserReviews(userName, 3, setReviews, setError);
    }
  };

  const handleEditReview = (review?: Review, reviewText?: string, rating?: number) => {
    if (review) {
      // Otwórz modal i ustaw recenzję do edycji
      setReviewToEdit(review);
      setShowModal(true);
    } else if (reviewToEdit && reviewText !== undefined && rating !== undefined) {
      // Zapisz edytowaną recenzję
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

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="header">
        <p className="user-name">{user?.userName}</p>
        {/* Przycisk edytuj widoczny tylko jeśli isOwner jest true */}
        {user?.isOwner && (
          <button className="edit-button" onClick={() => setShowEditUserModal(true)}>
            Edytuj
          </button>
        )}
      </div>

      <div className="info-row">
        <p className="info-label">Email:</p>
        <div className="info-value">{user?.email}</div>
      </div>

      <div className="info-row">
        <p className="info-label">Rola:</p>
        <div className="info-value">{user && getUserRoleName(user.userRole)}</div>
      </div>

      <div className="info-row">
        <p className="info-label">Ilość recenzji:</p>
        <div className="info-value">{user?.reviewsCount}</div>
      </div>

      <div className="pt-3">
        <h3 style={{ color: "white" }}>Ostatnie recenzje:</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              userPage={true}
              onDelete={() => handleDeleteReview(review.reviewId)}
              onEdit={() => handleEditReview(review)}
            />
          ))
        ) : (
          <p style={{ color: "white" }}>Brak recenzji</p>
        )}

        {(user?.reviewsCount ?? 0) > 3 && (
          <button
            className="review-btn"
            onClick={() => navigate(`/user/${userName}/reviews`)}
            style={{ marginBottom: "2%" }}
          >
            ...
          </button>
        )}
      </div>

      {/* Modal edycji recenzji */}
      {reviewToEdit && (
        <AddReviewModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddReview={(reviewText, rating) =>
            handleEditReview(undefined, reviewText, rating)
          } // Wywołanie zapisu edycji
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
        />
      )}

      {/* modal edycji uzytkownika */}
      {user && (
        <EditUserModal
          show={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          userData={user}
          onSave={(updatedUser) => {
            setUser(updatedUser); 
            setShowEditUserModal(false);
          }}
        />
      )}

    </>
  );
};

export default UserPage;
