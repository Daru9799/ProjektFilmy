import { decodeJWT } from "../hooks/decodeJWT";
import { createRelation } from "../API/relationApi";
import { deleteNotification, markNotificationAsRead } from "../API/notificationApi";
import { Notification } from "../models/Notification";


export const handleAcceptInvitation = async (notification: Notification, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Brak tokenu");
    return;
  }

  const decodedToken = decodeJWT(token);
  const loggedUserId = decodedToken.nameid;

  await createRelation(loggedUserId, notification.sourceUserId, 0, () => {}, setError);
  await deleteNotification(notification.notificationId, setError);
};

export const handleDeleteNotification = async (notification: Notification, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  await deleteNotification(notification.notificationId, setError);
};

export const handleViewResource = async (notification: Notification): Promise<string | null> => {
  console.log("Przejdź do:", notification.resource);
  if(notification.isRead == false)
  {
    console.debug("Odczytane!")
    await markNotificationAsRead(notification.notificationId);
  }
  if (notification.resource) 
  {
    return notification.resource
  }
  else
  {
    return null;
  }
};