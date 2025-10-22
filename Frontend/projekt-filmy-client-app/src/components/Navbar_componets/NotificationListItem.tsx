import { Notification } from "../../models/Notification";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteNotification, useMarkNotificationAsRead } from "../../API/NotificationApi";
import { useCreateRelation } from "../../API/RelationApi";
import { getLoggedUserId } from "../../hooks/decodeJWT";
import ActionPendingModal from "../SharedModals/ActionPendingModal";

interface NotificationDropdownItemProps {
  notification: Notification;
  isLast?: boolean;
}

const NotificationDropdownItem: React.FC<NotificationDropdownItemProps> = ({ notification, isLast }) => {
  const [error, setError] = useState<string | null>(null);
  const [isInvitation, setIsInvitation] = useState<boolean>(false);
  const navigate = useNavigate();
  const loggedUserId = getLoggedUserId();

  //Api
  const { mutate: deleteNotification, isPending: isDeletingNotification, apiError: deleteNotificationError} = useDeleteNotification();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: acceptToFriends, error: acceptToFriendsError } = useCreateRelation();

  const handleAccept = async () => {
    if (!loggedUserId) {
      console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
      return;
    }
    acceptToFriends({firstUserId: loggedUserId, secondUserId: notification.sourceUserId, type: 0});
    setIsInvitation(true);
    deleteNotification(notification.notificationId);
    window.location.reload();
  };

  const handleDelete = async () => {
    setIsInvitation(false);
    deleteNotification(notification.notificationId);
  };

  const handleView = () => {
    if (notification.isRead === false) {
      markAsRead(notification.notificationId);
    }
    
    if (notification.resource) {
      navigate(notification.resource);
    } else {
      return null;
    }
  };

  const renderActions = () => {
    switch (notification.type) {
      case "Invitation":
        return (
          <div className="d-flex gap-2 mt-2">
            <Button variant="success" size="sm" onClick={handleAccept}>
              Dodaj
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Odrzuć
            </Button>
            <Button variant="primary" size="sm" onClick={handleView}>
              Zobacz profil
            </Button>
          </div>
        );
      case "ReviewCommented":
      case "MovieRelease":
      case "CollectionReviewed":
        return (
          <div className="d-flex gap-2 mt-2">
            <Button variant="primary" size="sm" onClick={handleView}>
              Zobacz
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Usuń
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`list-group-item bg-white border-0 px-3 py-2 ${isLast ? '' : 'border-bottom'}`}>
      <div className="fw-semibold mb-1">{notification.title}</div>
      <div className="text-muted small">{notification.description}</div>
      {renderActions()}
      <ActionPendingModal show={isDeletingNotification && !isInvitation} message="Trwa usuwanie powiadomienia..."/>
      <ActionPendingModal show={isDeletingNotification && isInvitation} message="Trwa dodawanie do znajomych..."/>
    </div>
  );
};

export default NotificationDropdownItem;