import React from "react";
import { Notification } from "../../models/Notification";
import { Button } from "react-bootstrap";

interface NotificationCardProps {
  notification: Notification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const handleAccept = () => {
    console.log("Zaakceptowano zaproszenie:", notification.notificationId);
  };

  const handleDelete = () => {
    console.log("Usunięto powiadomienie:", notification.notificationId);
  };

  const handleView = () => {
    console.log("Przejdź do:", notification.resource);
    //Przenoszenie do resource
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
              Odrzuć
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
        backgroundColor: notification.isRead ? "#f8f9fa" : "#c2dafc", // ciemniejszy niebieski
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