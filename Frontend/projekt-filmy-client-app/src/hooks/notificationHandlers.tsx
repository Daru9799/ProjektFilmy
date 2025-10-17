import { getLoggedUserId } from "../hooks/decodeJWT";
import { createRelation } from "../API/RelationApi";
import { deleteNotification, markNotificationAsRead } from "../API/NotificationApi";
import { Notification } from "../models/Notification";


export const handleAcceptInvitation = async (notification: Notification, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  const loggedUserId = getLoggedUserId();
  
  if (!loggedUserId) {
    console.error("Brak zalogowanego użytkownika lub token niepoprawny.");
    return;
  }

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