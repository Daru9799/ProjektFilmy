import React from "react";
import AddReviewModal from "../review_components/AddReviewPanel";
import LoginModal from "../SingIn_SignUp_componets/LoginModal";

interface Props {
  isLoggedIn: boolean;
  showReviewModal: boolean;
  showLoginModal: boolean;
  setShowReviewModal: (value: boolean) => void;
  setShowLoginModal: (value: boolean) => void;
  handleAddReview: (review: string, rating: number) => void;
  handleLoginSuccess: (username: string) => void;
  userReview: any;
}

const ReviewActionsPanel: React.FC<Props> = ({
  isLoggedIn,
  showReviewModal,
  showLoginModal,
  setShowReviewModal,
  setShowLoginModal,
  handleAddReview,
  handleLoginSuccess,
  userReview,
}) => {
  return (
    <>
      {!userReview ? (
        isLoggedIn ? (
          <button
            className="btn btn-outline-light mt-3"
            onClick={() => setShowReviewModal(true)}
          >
            Dodaj recenzję
          </button>
        ) : (
          <button
            className="btn btn-outline-light mt-3"
            onClick={() => setShowLoginModal(true)}
          >
            Dodaj recenzję
          </button>
        )
      ) : (
        <p></p>
      )}

      <AddReviewModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onAddReview={handleAddReview}
      />

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default ReviewActionsPanel;
