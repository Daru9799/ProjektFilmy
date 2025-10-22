import { useState } from "react";
import { Notification } from "../../models/Notification";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDeleteNotification, useMarkNotificationAsRead } from "../../API/NotificationApi";
import { useCreateRelation } from "../../API/RelationApi";
import { getLoggedUserId } from "../../hooks/decodeJWT";
import ActionPendingModal from "../SharedModals/ActionPendingModal";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
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
            <div className="d-flex gap-2 mt-3">
                <Button variant="success" size="sm" onClick={handleAccept}>
                  Dodaj do znajomych
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Odrzuć zaproszenie
                </Button>
                <Button variant="primary" size="sm" onClick={handleView}>
                  Zobacz profil
                </Button>
            </div>
            );
        case "ReviewCommented":
            return (
            <div className="d-flex gap-2 mt-3">
                <Button variant="primary" size="sm" onClick={handleView}>
                  Zobacz komentarz
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Usuń powiadomienie
                </Button>
            </div>
            );
        case "MovieRelease":
            return (
            <div className="d-flex gap-2 mt-3">
                <Button variant="primary" size="sm" onClick={handleView}>
                  Zobacz stronę filmu
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Usuń powiadomienie
                </Button>
            </div>
            );
        case "CollectionReviewed":
            return (
            <div className="d-flex gap-2 mt-3">
                <Button variant="primary" size="sm" onClick={handleView}>
                  Zobacz recenzję
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Usuń powiadomienie
                </Button>
            </div>
            );
        default:
            return null;
        }
    };

  return (
    <div
      className="card shadow-sm"
      style={{
        backgroundColor: notification.isRead ? "#f8f9fa" : "#c2dafc",
      }}
    >
      <div className="card-body">
        <h5 className="card-title d-flex justify-content-between align-items-center">
          <span>{notification.title}</span>
          <small>{new Date(notification.date).toLocaleString()}</small>
        </h5>
        <p className="card-text text-start">{notification.description}</p>
        {renderActions()}
        <ActionPendingModal show={isDeletingNotification && !isInvitation} message="Trwa usuwanie powiadomienia..."/>
        <ActionPendingModal show={isDeletingNotification && isInvitation} message="Trwa dodawanie do znajomych..."/>
      </div>
    </div>
  );
};

export default NotificationCard;