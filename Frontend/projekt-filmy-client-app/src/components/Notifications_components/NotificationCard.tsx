import { useEffect, useState } from "react";
import { Notification } from "../../models/Notification";
import { Button } from "react-bootstrap";
import { decodeJWT } from "../../hooks/decodeJWT";
import { createRelation } from "../../API/relationApi";
import { getInvitationFromUser, deleteNotification } from "../../API/notificationApi";

interface NotificationCardProps {
  notification: Notification;
  onDelete: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDelete }) => {
    const [relations, setRelations] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAccept = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
        console.error("Brak tokenu");
        return;
        }

        const decodedToken = decodeJWT(token);
        const loggedUserId = decodedToken.nameid;

        //Tworzenie relacji (Friend)
        ///Tutaj trzeba ogarnąć najlepiej sourceUserId z notyfikacji
        await createRelation(loggedUserId, notification.sourceUserId, 0, setRelations, setError);
        
        //Usuwanie zaproszenia
        await deleteNotification(notification.notificationId, setError);

        console.log("Zaakceptowano zaproszenie");
        onDelete();
    };

    const handleDelete = async () => {
        await deleteNotification(notification.notificationId, setError)
        onDelete();
        console.log("Usuwanie powiadomienia");
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
                Odrzuć zaproszenie
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