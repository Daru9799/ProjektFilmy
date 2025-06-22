import React from "react";
import AddReviewModal from "../review_components/AddReviewModal";
import LoginModal from "../SingIn_SignUp_componets/LoginModal";

interface Props {
  isLoggedIn: boolean;
  showReviewModal: boolean;
  showLoginModal: boolean;
  setShowReviewModal: (value: boolean) => void;
  setShowLoginModal: (value: boolean) => void;
  handleAddReview: (review: string, rating: number) => void;
  handleLoginSuccess: (username: string) => void;
  handleChangeFollowing: () => void;
  userReview: any;
  isFollowing: boolean;
  inList: string | null;
  setInList: (value: string | null) => void;
  handleChangeWatched: () => void;
  handleChangePlanned: () => void;
}

const ReviewActionsPanel: React.FC<Props> = ({
  isLoggedIn,
  showReviewModal,
  showLoginModal,
  setShowReviewModal,
  setShowLoginModal,
  handleAddReview,
  handleLoginSuccess,
  handleChangeFollowing,
  userReview,
  isFollowing,
  inList,
  setInList,
  handleChangeWatched,
  handleChangePlanned,
}) => {
  return (
    <>
      {!userReview ? (
        isLoggedIn ? (
          <button
            className="btn btn-outline-light mt-3 w-100"
            onClick={() => setShowReviewModal(true)}
          >
            Dodaj recenzję
          </button>
        ) : (
          <button
            className="btn btn-outline-light mt-3 w-100"
            onClick={() => setShowLoginModal(true)}
          >
            Dodaj recenzję
          </button>
        )
      ) : (
        <p></p>
      )}
      {/* Dodaję przycisk do followania tutaj bo nie ma sensu zmieniać layoutu strony*/}
      {isLoggedIn ? (
        <button
          className="btn btn-outline-light mt-3 w-100"
          style={{ backgroundColor: !isFollowing ? "green" : "red" }}
          onClick={handleChangeFollowing}
        >
          {!isFollowing ? "Obserwuj" : "Przestań obserwować"}
        </button>
      ) : (
        <button
          className="btn btn-outline-light mt-3 w-100"
          style={{ backgroundColor: !isFollowing ? "green" : "red" }}
          onClick={() => setShowLoginModal(true)}
        >
          Obserwuj
        </button>
      )}

      {inList ? (
        <h5 className="mt-3">{`Stan filmu: ${inList}`} </h5>
      ) : (
        <h5 className="mt-3">Stan filmu: Nie objerzany</h5>
      )}
      {isLoggedIn ? (
        <button
          className="btn btn-outline-light mt-3 w-100"
          style={{
            backgroundColor:
              !inList || inList === "Obejrzany" ? "green" : "red",
          }}
          onClick={handleChangePlanned}
        >
          {!inList || inList === "Obejrzany"
            ? "Dodaj do planowanych"
            : "Usuń z planowanych"}
        </button>
      ) : (
        <button
          className="btn btn-outline-light mt-3 w-100"
          style={{ backgroundColor: !isFollowing ? "green" : "red" }}
          onClick={() => setShowLoginModal(true)}
        >
          Dodaj do planowanych
        </button>
      )}

      {isLoggedIn ? (
        <button
          className="btn btn-outline-light mt-3 w-100"
          style={{
            backgroundColor:
              !inList || inList === "Planowany" ? "green" : "red",
          }}
          onClick={handleChangeWatched}
        >
          {!inList || inList === "Planowany"
            ? "Dodaj do obejrzanych"
            : "Usuń z obejrzanych"}
        </button>
      ) : (
        <button
          className="btn btn-outline-light mt-3 w-100"
          style={{ backgroundColor: !isFollowing ? "green" : "red" }}
          onClick={() => setShowLoginModal(true)}
        >
          Dodaj do obejrzanych
        </button>
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
