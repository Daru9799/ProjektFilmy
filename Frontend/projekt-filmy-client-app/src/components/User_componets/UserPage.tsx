import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserProfile, userRole } from "../../models/UserProfile";
import { Review } from "../../models/Review";
import ReviewCard from "../review_components/ReviewCard";
import AddReviewModal from "../review_components/AddReviewPanel";
import EditUserModal from "./EditUserModal";
import { fetchUserData, fetchUserReviews } from "../../API/userAPI";
import {
  fetchRelationsData,
  deleteRelation,
  createRelation,
} from "../../API/relationApi";
import {
  sendFriendInvitation,
  checkIsInvited,
  checkIsInvitedByUser,
  getInvitationFromUser,
  deleteNotification,
} from "../../API/notificationApi";
import { deleteReview, editReview } from "../../API/reviewApi";
import ConfirmationModal from "../SharedModals/ConfirmationModal";
import { isUserMod, getLoggedUserId } from "../../hooks/decodeJWT";
import "../../styles/UserPage.css";
import ChangeRoleModal from "./ChangeRoleModal";
import InfoModal from "../SharedModals/InfoModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isInvitedByUser, setIsInvitedByUser] = useState(false);
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    variant: "success" | "danger" | "warning";
  }>({ show: false, title: "", message: "", variant: "danger" });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserName = localStorage.getItem("logged_username");
    if (userName) {
      fetchUserData(userName, setUser, setError, setLoading, navigate);
      fetchUserReviews(userName, 3, setReviews, setError);
      if (loggedUserName) {
        fetchRelationsData(
          loggedUserName,
          "",
          setRelations,
          setError,
          navigate
        );
      }
    }
    console.log("Czy użytkownik jest właścicielem?", user?.isOwner);

    if (loggedUserName && userName) {
      const loggedUserId = getLoggedUserId();

      if (!loggedUserId) {
        console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
        return;
      }

      //Sprawdzanie czy mod
      setIsLoggedUserMod(isUserMod());

      checkIsInvitedByUser(loggedUserId, userName).then(setIsInvitedByUser);
    }
  }, [userName]);

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId, setReviews);

      // Odśwież dane z serwera
      if (userName) {
        fetchUserData(userName, setUser, setError, setLoading, navigate);
        fetchUserReviews(userName, 3, setReviews, setError);
      }
    } catch (err) {
      console.error("Błąd podczas usuwania recenzji:", err);
    }
  };

  const handleEditReview = (
    review?: Review,
    reviewText?: string,
    rating?: number
  ) => {
    if (review) {
      // Otwórz modal i ustaw recenzję do edycji
      setReviewToEdit(review);
      setShowModal(true);
    } else if (
      reviewToEdit &&
      reviewText !== undefined &&
      rating !== undefined
    ) {
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

  const handleDeleteRel = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteRelation(
      relations?.$values.find(
        (relation: any) =>
          relation.type === "Friend" &&
          relation.relatedUserName === user?.userName
      )?.relationId
    );
    setShowDeleteModal(false);
  };

  const handleDeleteRelation = async (relationId: string) => {
    try {
      await deleteRelation(relationId, setRelations);
      setRelations((prevRelations: any) => {
        const updatedRelations = { ...prevRelations };
        updatedRelations.$values = updatedRelations.$values.filter(
          (relation: any) => relation.relationId !== relationId
        );
        return updatedRelations;
      });
    } catch (error) {
      window.location.reload();
    }
  };

  const sendInvitation = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showInfoModal(
        "Błąd",
        "Musisz być zalogowany, aby wykonać tę akcję.",
        "danger"
      );
      return;
    }

    //Dekodowanie tokenu
    if (user) {
      const alreadyInvited = await checkIsInvited(user.id);
      if (alreadyInvited) {
        showInfoModal(
          "Informacja",
          "Ten użytkownik został już zaproszony.",
          "danger"
        );
        return;
      }

      const sourceUserId = getLoggedUserId(); //Id użytkownika, który wysyła zaproszenie
      const sourceUserName = localStorage.getItem("logged_username");
      const targetUserId = user.id; //Id użytkownika docelowego

      if (sourceUserId == null) return;

      try {
        await sendFriendInvitation(
          targetUserId,
          sourceUserId,
          sourceUserName,
          setNotification
        );
        showInfoModal(
          "Informacja",
          "Pomyślnie wysłano zaproszenie do grona znajomych!",
          "success"
        );
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          window.location.reload();
        } else {
          showInfoModal(
            "Informacja",
            "Coś poszło nie tak. Spróbuj ponownie.",
            "danger"
          );
        }
      }
    }
  };

  const handleAcceptInvitation = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showInfoModal(
        "Błąd",
        "Musisz być zalogowany, aby wykonać tę akcję.",
        "danger"
      );
      return;
    }

    const loggedUserId = getLoggedUserId();

    if (!user || !loggedUserId) return;

    //Utworzenie relacji
    await createRelation(loggedUserId, user.id, 0, setRelations, setError);

    //Pobranie zaproszeń
    const invitation = await getInvitationFromUser(loggedUserId, user.userName);

    //Usuwanie zaproszenia
    if (invitation) {
      await deleteNotification(invitation.notificationId, setError);
    }

    //Odświeżenie dla przycisków
    await fetchRelationsData(
      localStorage.getItem("logged_username")!,
      "",
      setRelations,
      setError,
      navigate
    );
    setIsInvitedByUser(false);
  };

  const handleBlock = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      showInfoModal(
        "Błąd",
        "Musisz być zalogowany, aby wykonać tę akcję.",
        "danger"
      );
      return;
    }

    const loggedUserId = getLoggedUserId();

    if (!user || !loggedUserId) return;

    //Utworzenie relacji
    await createRelation(loggedUserId, user.id, 1, setRelations, setError);

    //Odświeżenie dla przycisków
    await fetchRelationsData(
      localStorage.getItem("logged_username")!,
      "",
      setRelations,
      setError,
      navigate
    );
  };

  const isFriend = relations?.$values.some(
    (relation: any) =>
      relation.type === "Friend" && relation.relatedUserName === user?.userName
  );

  const isBlocked = relations?.$values.some(
    (relation: any) =>
      relation.type === "Blocked" && relation.relatedUserName === user?.userName
  );

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p className="error">{error}</p>;

  if (isBlocked) {
    navigate("/"); //W przypadku bloka przenosi na /
    return null;
  }

  const showInfoModal = (
    title: string,
    message: string,
    variant: "success" | "danger" | "warning" = "danger"
  ) => {
    setInfoModal({ show: true, title, message, variant });
  };

  return (
    <>
      <div style={{ minHeight: "90vh" }}>
        <div className="header">
          <p className="user-name">{user?.userName}</p>

          <div className="relation-buttons">
            {!user?.isOwner && (
              <>
                {isInvitedByUser ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleAcceptInvitation}
                  >
                    Akceptuj zaproszenie
                  </button>
                ) : !isFriend ? (
                  <button className="btn btn-success" onClick={sendInvitation}>
                    Dodaj do znajomych
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={handleDeleteRel}>
                    Usuń ze znajomych
                  </button>
                )}
                {!isFriend && (
                  <button className="btn btn-danger" onClick={handleBlock}>
                    Zablokuj
                  </button>
                )}
              </>
            )}
          </div>
          {/*
          Zmieniam visibility na display, bo inaczej się przyciski psują,
          visibility renderuje obiekty i potem je ukrywa, czyli ostatecznie one tam są i zabierają miejsce ale nie mozna z nimi interaktować
          display: none, nie renderuje obiektów  wiec nie ma takiego tłoku w tym rzędzie
          jeżeli będą jeszcze jakieś przyciski dodawane to można pokombinowac z innym rozwiązaniem 
          */}
          {/*
              Ogolnie to wszysztko działa, ale pojawia się problem z tym, że kiedy użytkownik sam sobie moda zabierze,
              to do momentu wylogowania wciąż widzi przycisk, ale nie może zmienić roli. Aktualnie sprawdzam czy użytkownik jest modem
              poprzez JWT więc pewnio to jest przyczyną, jak macie jakieś pomysły jak to inaczej zrobić to chętnie skorzystam z pomocy.
              Drugi problem jest taki że po zmianie roli z usera na krytyka i wice wersa nie zmieniają się kolory recenzji, dopiero po
              odświeżeniu. 
            */}
          <div className="header-buttons">
            <button
              className="edit-button"
              style={{
                display: isLoggedUserMod ? "flex" : "none",
              }} // pokazuje przycisk tylko jeżeli zalogowany user to mod
              onClick={() =>
                (isLoggedUserMod && setShowChangeRoleModal(true)) ||
                console.log(user)
              }
            >
              Zmień rolę
            </button>

            <button
              className="edit-button"
              style={{ display: user?.isOwner ? "flex" : "none" }} // nie pokazuje przycisków jak nie jestesmy zalogowani
              onClick={() => user?.isOwner && setShowEditUserModal(true)}
            >
              Edytuj
            </button>
            <button
              className="edit-button"
              style={{ display: user?.isOwner ? "flex" : "none" }}
              onClick={() => navigate(`/users/statistics/${user?.userName}`)}
            >
              Statystyki
            </button>
            <button
              className="edit-button"
              style={{ display: user?.isOwner ? "flex" : "none" }}
              onClick={() => navigate(`/user/achievements/${user?.userName}`)}
            >
              Osiągnięcia
            </button>
            <button
              className="edit-button"
              style={{ display: user?.isOwner ? "flex" : "none" }}
              onClick={() =>
                navigate(`/user/${user?.userName}/moviecollection/create`)
              }
            >
              Dodaj listę
            </button>
          </div>
        </div>

        <div className="info-row">
          <p className="info-label">Email:</p>
          <div className="info-value">{user?.email}</div>
        </div>

        <div className="info-row">
          <p className="info-label">Rola:</p>
          <div className="info-value">
            {user && getUserRoleName(user.userRole)}
          </div>
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

        {/* modal zmiany roli*/}
        {user && (
          <ChangeRoleModal
            show={showChangeRoleModal}
            onClose={() => setShowChangeRoleModal(false)}
            userData={user}
            onSave={(updatedUser) => {
              setUser(updatedUser);
              setShowChangeRoleModal(false);
            }}
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
      </div>
    </>
  );
};

export default UserPage;
