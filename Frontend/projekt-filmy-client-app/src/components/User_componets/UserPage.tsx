import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import ReviewCard from "../review_components/ReviewCard";
import AddReviewModal from "../review_components/AddReviewPanel";
import EditUserModal from "./EditUserModal";
import { fetchUserData, fetchUserReviews } from "../../API/userAPI";
import { fetchRelationsData, deleteRelation } from "../../API/relationApi";
import { deleteReview, editReview } from "../../API/reviewApi";
import "../../styles/UserPage.css"


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
  const [relations, setRelations] = useState<any>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserName = localStorage.getItem("logged_username");
    if (userName) {
      fetchUserData(userName, setUser, setError, setLoading);
      fetchUserReviews(userName, 3, setReviews, setError);
      if (loggedUserName)
      {
        fetchRelationsData(loggedUserName, setRelations, setError);
      }
    }
    console.log("Czy użytkownik jest właścicielem?", user?.isOwner);
  }, [userName]);

 
    const handleDeleteReview = async (reviewId: string) => {
      try {
    
        await deleteReview(reviewId, setReviews);
    
        // Odśwież dane z serwera
        if (userName) {
          fetchUserData(userName, setUser, setError, setLoading);
          fetchUserReviews(userName, 3, setReviews, setError);
        }
      } catch (err) {
        console.error("Błąd podczas usuwania recenzji:", err);
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

  const handleDeleteRelation = async (relationId: string) => {
    await deleteRelation(relationId, setRelations, setError);
    if (userName) {
        setLoading(true);
        fetchRelationsData(userName, setRelations, setError).finally(() => {
        setLoading(false);
      });
    }
  };

  const isFriend = relations?.$values.some(
    (relation: any) => relation.type === "Friend" && relation.relatedUserName === user?.userName
  );

  const isBlocked = relations?.$values.some(
    (relation: any) => relation.type === "Blocked" && relation.relatedUserName === user?.userName
  );

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="error">{error}</p>;

  if (isBlocked) {
      navigate("/"); //W przypadku bloka przenosi na /
      return null;
  }

  return (
    <>
    <div style={{minHeight:"90vh"}}>
      <div className="header">
        <p className="user-name">{user?.userName}</p>

        <div className="relation-buttons">
          {!user?.isOwner && (
            <>
              {!isFriend ? (
                <button className="btn btn-success">
                  Dodaj do znajomych
                </button>
              ) : (
                <button className="btn btn-danger" onClick={() => handleDeleteRelation(relations?.$values.find((relation: any) => relation.type === "Friend" && relation.relatedUserName === user?.userName)?.relationId)}>
                  Usuń ze znajomych
                </button>
              )}
              {!isFriend && (
                  <button className="btn btn-danger">
                    Zablokuj
                  </button>
                )}
            </>
          )}
        </div>

        <div className="header-buttons">
          <button
            className="edit-button"
            style={{ visibility: user?.isOwner ? "visible" : "hidden" }}
            onClick={() => user?.isOwner && setShowEditUserModal(true)}
          >
            Edytuj
          </button>
          <button
            className="edit-button"
            onClick={()=>navigate(`/users/statistics/${user?.userName}`)}
          >
            Statystyki
          </button>
          <button
            className="edit-button"
            onClick={() => navigate(`/user-achievements/${user?.userName}`)}
          >
            Osiągnięcia
          </button>
        </div>
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

      <div className="reviews">
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
            className="btn btn-outline-light mt-3"
            onClick={() => navigate(`/user/${userName}/reviews`)}
            style={{ marginBottom: "2%" }}
          >
            Wszystkie recenzje
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
</div>
    </>
  );
};

export default UserPage;
