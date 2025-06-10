import { useEffect, useState } from "react";
import { Notification } from "../../models/Notification";
import { Button } from "react-bootstrap";
import { handleAcceptInvitation, handleDeleteNotification, handleViewResource } from "../../hooks/notificationHandlers";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../components/Notifications_components/NotificationsContext";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
    const [error, setError] = useState<string | null>(null);
    const { removeNotification } = useNotificationContext();
    const navigate = useNavigate();

    const handleAccept = async () => {
      await handleAcceptInvitation(notification, setError);
      removeNotification(notification.notificationId);
    };

    const handleDelete = async () => {
      await handleDeleteNotification(notification, setError);
      removeNotification(notification.notificationId);
    };

    const handleView = async () => {
      const resource = await handleViewResource(notification);
      if (resource) {
        navigate(resource);
      } else {
        setError("ERROR");
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
      </div>
    </div>
  );
};

export default NotificationCard;