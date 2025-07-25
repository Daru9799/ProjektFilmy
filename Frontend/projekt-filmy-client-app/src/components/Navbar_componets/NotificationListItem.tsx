import { Notification } from "../../models/Notification";
import { Button } from "react-bootstrap";
import { useState } from "react";
import { handleAcceptInvitation, handleDeleteNotification, handleViewResource } from "../../hooks/notificationHandlers";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../components/Notifications_components/NotificationsContext";

interface NotificationDropdownItemProps {
  notification: Notification;
  isLast?: boolean;
}

const NotificationDropdownItem: React.FC<NotificationDropdownItemProps> = ({ notification, isLast }) => {
  const [error, setError] = useState<string | null>(null);
  const { removeNotification } = useNotificationContext();
  const navigate = useNavigate();

  const handleAccept = async () => {
    await handleAcceptInvitation(notification, setError);
    removeNotification(notification.notificationId);
    window.location.reload();
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
    </div>
  );
};

export default NotificationDropdownItem;