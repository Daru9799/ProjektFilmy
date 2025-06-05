import axios from "axios";
import { Notification } from "../models/Notification";

export const sendFriendInvitation = async (
  targetUserId: string,
  sourceUserId: string,
  sourceUserName: string | null,
  setNotification: React.Dispatch<React.SetStateAction<any | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.post(
      "https://localhost:7053/api/Notifications/add-notification",
      {
        title: `Zaproszenie do znajomych od użytkownika ${sourceUserName}!`,
        description: `${sourceUserName} zaprasza Cię do grona znajomych!`,
        type: "Invitation",
        date: new Date().toISOString(),
        isRead: false,
        resource: "ZASÓB TESTOWY",
        sourceUserId: sourceUserId,
        targetUserId: targetUserId, //Id zapraszanego usera
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setNotification(response.data);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        setError("Nie udało się znaleźć użytkownika docelowego");
      } else {
        setError("Wystąpił błąd podczas wysyłania zaproszenia.");
      }
    }
    console.error(err);
  }
};

export const checkIsInvited = async (targetUserId: string): Promise<boolean> => {
  const loggedUserName = localStorage.getItem("logged_username");

  if (!loggedUserName) {
    console.error("Brak zalogowanego użytkownika.");
    return false;
  }

  try {
    const response = await axios.get(`https://localhost:7053/api/Notifications/by-user-id/${targetUserId}`, {
      params: {
        type: "Invitation",
        disablePagination: true,
        sourceUserName: loggedUserName,
      },
    });

    const notifications: Notification[] = response.data.data?.$values ?? [];

    return notifications.some(n => n.sourceUserName === loggedUserName);
  } catch (error) {
    console.error("Błąd podczas sprawdzania zaproszenia:", error);
    return false;
  }
};

