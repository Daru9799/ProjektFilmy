// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { UserProfile, userRole } from "../../models/UserProfile";
// import { Review } from "../../models/Review";
// import { fetchUserData, fetchUserReviews, deleteReview } from "../../functions/ReloadFunctions";
// import "./UserPage.css";
// import ReviewCard from "../review_components/ReviewCard";

// function getUserRoleName(role: userRole): string {
//   switch (role) {
//     case userRole.user:
//       return "Normalny użytkownik";
//     case userRole.critic:
//       return "Krytyk";
//     case userRole.mod:
//       return "Moderator";
//     default:
//       return "Nieznany";
//   }
// }

// const UserPage = () => {
//   const { userName } = useParams();
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (userName) {
//       fetchUserData(userName, setUser, setError, setLoading);
//       fetchUserReviews(userName,3, setReviews, setError);
//     }
//   }, [userName]);

//   const handleDeleteReview = (reviewId: string) => {
//     deleteReview(reviewId, setReviews);
//     if(userName)
//     fetchUserReviews(userName,3, setReviews, setError);
//   };

//   if (loading) return <p>Ładowanie danych...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <>
//       <div className="header">
//         <p className="user-name">{user?.userName}</p>
//         <button className="edit-button">Edytuj</button>
//       </div>

//       <div className="info-row">
//         <p className="info-label">Email:</p>
//         <div className="info-value">{user?.email}</div>
//       </div>

//       <div className="info-row">
//         <p className="info-label">Rola:</p>
//         <div className="info-value">{user && getUserRoleName(user.userRole)}</div>
//       </div>

//       <div className="info-row">
//         <p className="info-label">Ilość recenzji:</p>
//         <div className="info-value">{user?.reviewsCount}</div>
//       </div>

//       <div className="pt-3">
//         <h3 style={{ color: "white" }}>Ostatnie recenzje:</h3>
//         {reviews.length > 0 ? (
//           reviews.map((review) => (
//             <ReviewCard
//               key={review.reviewId}
//               review={review}
//               showMovieTitle={true}
//               onDelete={() => handleDeleteReview(review.reviewId)}
//             />
//           ))
//         ) : (
//           <p style={{ color: "white" }}>Nie dodałeś jeszcze żadnych recenzji</p>
//         )}

//         {(user?.reviewsCount ?? 0) > 3 && (
//           <button
//             className="review-btn"
//             onClick={() => navigate(`/user/${userName}/reviews`)}
//           >
//             ...
//           </button>
//         )}
//       </div>
//     </>
//   );
// };

// export default UserPage;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import { fetchUserData, fetchUserReviews, deleteReview, editReview } from "../../functions/ReloadFunctions";
import "./UserPage.css";
import ReviewCard from "../review_components/ReviewCard";
import AddReviewModal from "../review_components/AddReviewPanel"; // Modal for editing reviews

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
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null); // The review to be edited
  const navigate = useNavigate();

  useEffect(() => {
    if (userName) {
      fetchUserData(userName, setUser, setError, setLoading);
      fetchUserReviews(userName, 3, setReviews, setError);
    }
  }, [userName]);

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId, setReviews);
    if (userName) fetchUserReviews(userName, 3, setReviews, setError);
  };

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review); // Store the review for editing
    setShowModal(true); // Show the modal
  };

  const handleSaveEditedReview = (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      // Edit the review and update the state
      editReview(
        reviewToEdit.reviewId,
        { comment: reviewText, rating },
        setReviews,
        setError
      );
      setShowModal(false); // Close the modal
      setReviewToEdit(null); // Clear the review to edit
    }
  };

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="header">
        <p className="user-name">{user?.userName}</p>
        <button className="edit-button">Edytuj</button>
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
              showMovieTitle={true}
              onDelete={() => handleDeleteReview(review.reviewId)}
              onEdit={() => handleEditReview(review)} // Trigger the edit function
            />
          ))
        ) : (
          <p style={{ color: "white" }}>Nie dodałeś jeszcze żadnych recenzji</p>
        )}

        {(user?.reviewsCount ?? 0) > 3 && (
          <button
            className="review-btn"
            onClick={() => navigate(`/user/${userName}/reviews`)}
          >
            ...
          </button>
        )}
      </div>

      {/* Modal for editing a review */}
      {reviewToEdit && (
        <AddReviewModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddReview={handleSaveEditedReview}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
        />
      )}
    </>
  );
};

export default UserPage;

