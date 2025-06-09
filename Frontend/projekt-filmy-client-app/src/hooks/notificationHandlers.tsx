import { decodeJWT } from "../hooks/decodeJWT";
import { createRelation } from "../API/relationApi";
import { deleteNotification } from "../API/notificationApi";
import { Notification } from "../models/Notification";

export const handleAcceptInvitation = async (notification: Notification, onDelete: () => void, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Brak tokenu");
    return;
  }

  const decodedToken = decodeJWT(token);
  const loggedUserId = decodedToken.nameid;

  await createRelation(loggedUserId, notification.sourceUserId, 0, () => {}, setError);
  await deleteNotification(notification.notificationId, setError);
  onDelete();
};

export const handleDeleteNotification = async (notification: Notification, onDelete: () => void, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  await deleteNotification(notification.notificationId, setError);
  onDelete();
};

export const handleViewResource = (notification: Notification): string | null => {
  console.log("Przejdź do:", notification.resource);
  if (notification.resource) 
  {
    return notification.resource
  }
  else
  {
    return null;
  }
};