import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userRole } from "../models/UserProfile";
import { Review } from "../models/Review";
import ReviewCard from "../components/review_components/ReviewCard";
import AddReviewModal from "../components/review_components/AddReviewModal";
import EditUserModal from "../components/User_componets/EditUserModal";
import { useUserReviews, useUserData } from "../API/UserApi";
import { useDeleteRelation, useCreateRelation } from "../API/RelationApi";
import { useSendFriendInvitation, useCheckIsInvitedByUser } from "../API/NotificationApi";
import { useDeleteReview, useEditReview } from "../API/ReviewApi";
import ConfirmationModal from "../components/SharedModals/ConfirmationModal";
import { isUserMod, getLoggedUserId } from "../hooks/decodeJWT";
import "../styles/UserPage.css";
import ChangeRoleModal from "../components/User_componets/ChangeRoleModal";
import InfoModal from "../components/SharedModals/InfoModal";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import SpinnerLoader from "../components/SpinnerLoader";
import { toast } from "react-toastify";
import { getApiError } from "../functions/getApiError";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

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
  const [error] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    variant: "success" | "danger" | "warning";
  }>({ show: false, title: "", message: "", variant: "danger" });
  const navigate = useNavigate();
  const [reload, setReload] = useState<boolean>(false);

  //Api hooks
  const { data: reviewData, isLoading: reviewLoading, apiError: reviewsError } = useUserReviews(userName, 1, 5);
  const reviews = reviewData?.reviews ?? [];
  const { data: user, isLoading: userLoading, apiError: userError, refetch: refetchUser } = useUserData(userName);
  const { data: isInvitedByUser } = useCheckIsInvitedByUser(getLoggedUserId(), userName!);

  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview } = useDeleteReview();
  const { mutate: editReview, isPending: isEditingReview } = useEditReview();
  const { mutate: deleteFromFriends, isPending: isDeletingFromFriends } = useDeleteRelation();
  const { mutate: acceptToFriends, isPending: isAcceptingToFriends } = useCreateRelation();
  const { mutate: blockUser } = useCreateRelation();
  const { mutate: sendFriendRequest, isPending: sendingFriendRequest } = useSendFriendInvitation();

  useEffect(() => {
    setReload(false);
    const loggedUserName = localStorage.getItem("logged_username");
    if (loggedUserName && userName) {
      const loggedUserId = getLoggedUserId();
      if (!loggedUserId) return;
      setIsLoggedUserMod(isUserMod());
    }
  }, [userName, reload]);

  const handleDeleteReview = async (reviewId: string) => {
    deleteReview(reviewId, {
      onSuccess: () => toast.success("Recenzja została usunięta pomyślnie!"),
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się usunąć recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  const handleEditReview = (review?: Review, reviewText?: string, rating?: number) => {
    if (review) {
      setReviewToEdit(review);
      setShowModal(true);
    } else if (reviewToEdit && reviewText !== undefined && rating !== undefined) {
      editReview(
        { reviewId: reviewToEdit.reviewId, updatedReview: { comment: reviewText, rating } },
        {
          onSuccess: () => {
            setShowModal(false);
            setReviewToEdit(null);
            toast.success("Recenzja została zaktualizowana pomyślnie!");
          },
          onError: (err) => {
            const apiErr = getApiError(err);
            toast.error(`Nie udało się zaktualizować recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
          },
        }
      );
    }
  };

  const handleDeleteRel = () => setShowDeleteModal(true);
  const handleCancelDelete = () => setShowDeleteModal(false);
  const handleConfirmDelete = () => {
    if (!user?.relationId) return;
    handleDeleteRelation(user.relationId);
    setShowDeleteModal(false);
  };
  const handleDeleteRelation = async (relationId: string) => {
    deleteFromFriends(relationId, {
      onSuccess: () => {
        window.location.reload();
        toast.success("Użytkownik został usunięty ze znajomych pomyślnie!");
      },
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się usunąć użytkownika ze znajomych. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  const sendInvitation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showInfoModal("Błąd", "Musisz być zalogowany, aby wykonać tę akcję.", "danger");
      return;
    }
    if (user) {
      const sourceUserId = getLoggedUserId();
      const sourceUserName = localStorage.getItem("logged_username");
      const targetUserId = user.id;
      if (!sourceUserId) return;
      sendFriendRequest({ targetUserId, sourceUserId, sourceUserName }, {
        onSuccess: () => toast.info(`Pomyślnie wysłano zaproszenie użytkownikowi ${user.userName}`),
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się wysłać zaproszenia. [${apiErr?.statusCode}] ${apiErr?.message}`);
        },
      });
    }
  };

  const handleAcceptInvitation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showInfoModal("Błąd", "Musisz być zalogowany, aby wykonać tę akcję.", "danger");
      return;
    }
    const loggedUserId = getLoggedUserId();
    if (!user || !loggedUserId) return;
    acceptToFriends({ firstUserId: loggedUserId, secondUserId: user.id, type: 0 }, {
      onSuccess: () => toast.success(`Pomyślnie dodano użytkownika ${user.userName} do znajomych!`),
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się zaakceptować zaproszenia. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  const handleBlock = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showInfoModal("Błąd", "Musisz być zalogowany, aby wykonać tę akcję.", "danger");
      return;
    }
    const loggedUserId = getLoggedUserId();
    if (!user || !loggedUserId) return;
    blockUser({ firstUserId: loggedUserId, secondUserId: user.id, type: 1 }, {
      onSuccess: () => {
        toast.success(`Użytkownik ${user.userName} został zablokowany!`);
        navigate("/");
      },
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się zablokować użytkownika. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };

  if (error) return <p className="error">{error}</p>;
  if (user?.relationType === "Blocked") {
    navigate("/");
    return null;
  }

  const showInfoModal = (title: string, message: string, variant: "success" | "danger" | "warning" = "danger") => {
    setInfoModal({ show: true, title, message, variant });
  };

  if (userLoading) return <SpinnerLoader />;
  if (userError) return <ApiErrorDisplay apiError={userError} />;

return (
  <>
    <div style={{ minHeight: "90vh" }}>
      <div className="header">
        <p className="user-name">{user?.userName}</p>

        {/* Desktop buttons */}
        <div className="d-none d-md-flex align-items-center header-buttons">
          <button className="edit-button me-2" onClick={() => navigate(`movieCollection`)}>Kolekcje</button>

          {!user?.isOwner && user?.relationType === "None" && (
            <>
              {isInvitedByUser ? (
                <button className="btn btn-primary me-2" onClick={handleAcceptInvitation}>Akceptuj zaproszenie</button>
              ) : (
                <button className="green-button me-2" onClick={sendInvitation}>Dodaj do znajomych</button>
              )}
              <button className="cancel-button me-2" onClick={handleBlock}>Zablokuj</button>
            </>
          )}

          {!user?.isOwner && user?.relationType === "Friend" && (
            <button className="red-button me-2" onClick={handleDeleteRel}>Usuń ze znajomych</button>
          )}

          {isLoggedUserMod && !user?.isOwner && (
            <button className="edit-button me-2" onClick={() => setShowChangeRoleModal(true)}>Zmień rolę</button>
          )}

          {user?.isOwner && (
            <>
              <button className="edit-button me-2" onClick={() => setShowEditUserModal(true)}>Edytuj</button>
              <button className="edit-button me-2" onClick={() => navigate(`/users/statistics/${user?.userName}`)}>Statystyki</button>
              <button className="edit-button me-2" onClick={() => navigate(`/user/achievements/${user?.userName}`)}>Osiągnięcia</button>
              <button className="edit-button me-2" onClick={() => navigate(`/user/${user?.userName}/moviecollection/create`)}>Dodaj listę</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="d-flex d-md-none flex-column w-100">
          <button
            className="btn btn-light mb-2 d-flex justify-content-center align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#userActionsCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style ={{backgroundColor: "transparent",border: "none",padding: "0.5rem 1rem"}}
          >
            {/* Wyraźna ikona hamburger */}
            <span style={{ fontSize: "1.5rem", color: "white" }}>☰</span>
          </button>

          <div className="collapse" id="userActionsCollapse">
            <div className="d-flex flex-column">
              <button className="edit-button mb-2" onClick={() => navigate(`movieCollection`)}>Kolekcje</button>

              {!user?.isOwner && user?.relationType === "None" && (
                <>
                  {isInvitedByUser ? (
                    <button className="green-button mb-2" onClick={handleAcceptInvitation}>Akceptuj zaproszenie</button>
                  ) : (
                    <button className="green-button me-2" onClick={sendInvitation}>Dodaj do znajomych</button>
                  )}
                  <button className="cancel-button mb-2" onClick={handleBlock}>Zablokuj</button>
                </>
              )}

              {!user?.isOwner && user?.relationType === "Friend" && (
                <button className="red-button mb-2" onClick={handleDeleteRel}>Usuń ze znajomych</button>
              )}

              {isLoggedUserMod && !user?.isOwner && (
                <button className="edit-button mb-2" onClick={() => setShowChangeRoleModal(true)}>Zmień rolę</button>
              )}

              {user?.isOwner && (
                <>
                  <button className="edit-button mb-2" onClick={() => setShowEditUserModal(true)}>Edytuj</button>
                  <button className="edit-button mb-2" onClick={() => navigate(`/users/statistics/${user?.userName}`)}>Statystyki</button>
                  <button className="edit-button mb-2" onClick={() => navigate(`/user/achievements/${user?.userName}`)}>Osiągnięcia</button>
                  <button className="edit-button mb-2" onClick={() => navigate(`/user/${user?.userName}/moviecollection/create`)}>Dodaj listę</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* info-container, recenzje, modale i ActionPendingModal bez zmian */}
      <div className="info-container">
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
      </div>

      <div className="reviews">
        <h3 style={{ color: "white" }}>Ostatnie recenzje:</h3>
        {reviewLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
            <SpinnerLoader />
          </div>
        ) : reviewsError ? (
          <p style={{ color: "red" }}>
            <ApiErrorDisplay apiError={reviewsError} />
          </p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              userPage={true}
              onDelete={() => handleDeleteReview(review.reviewId)}
              onEdit={() => handleEditReview(review)}
              isLoggedUserMod={isLoggedUserMod}
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

      {/* Modale */}
      {reviewToEdit && (
        <AddReviewModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddReview={(reviewText, rating) =>
            handleEditReview(undefined, reviewText, rating)
          }
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating}
          headerText={"Edytuj recenzję"}
          buttonText={"Zapisz zmiany"}
        />
      )}

      {user && (
        <ChangeRoleModal
          show={showChangeRoleModal}
          onClose={() => setShowChangeRoleModal(false)}
          userData={user}
        />
      )}

      {user && (
        <EditUserModal
          show={showEditUserModal}
          onClose={() => setShowEditUserModal(false)}
          userData={user}
          onSave={(updatedUser) => {
            refetchUser();
            setShowEditUserModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          show={showDeleteModal}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Potwierdzenie usunięcia"
          message="Czy na pewno chcesz usunąć tego użytkownika ze znajomych?"
          confirmButtonText="Usuń"
          confirmButtonVariant="danger"
        />
      )}

      <InfoModal
        show={infoModal.show}
        onClose={() => setInfoModal({ ...infoModal, show: false })}
        title={infoModal.title}
        message={infoModal.message}
        variant={infoModal.variant}
      />

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..." />
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..." />
      <ActionPendingModal show={isAcceptingToFriends} message="Trwa dodawanie do znajomych..." />
      <ActionPendingModal show={isDeletingFromFriends} message="Trwa usuwanie ze znajomych..." />
      <ActionPendingModal show={sendingFriendRequest} message="Trwa wysyłanie zaproszenia do znajomych" />
    </div>
  </>
);

};

export default UserPage;
