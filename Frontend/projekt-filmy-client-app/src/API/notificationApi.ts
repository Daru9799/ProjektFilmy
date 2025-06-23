import axios from "axios";
import { Notification } from "../models/Notification";
import { PaginationResponse } from "../API/PaginationResponse"
import { NotificationType } from "../models/NotificationType";

export const sendFriendInvitation = async (
  targetUserId: string,
  sourceUserId: string,
  sourceUserName: string | null,
  setNotification: React.Dispatch<React.SetStateAction<any | null>>,
) => {
    const response = await axios.post(
      "https://localhost:7053/api/Notifications/add-notification",
      {
        title: `Zaproszenie do grona znajomych!`,
        description: `${sourceUserName} zaprasza Cię do grona znajomych!`,
        type: "Invitation",
        date: new Date().toISOString(),
        isRead: false,
        resource: `/user/${sourceUserName}`,
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
};

//Sprawdzanie czy zalogowany A zaprosił już B (aby nie mógł zapraszać dwukrotnie)
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    const notifications: Notification[] = response.data.data?.$values ?? [];

    return notifications.length > 0;
  } catch (error) {
    console.error("Błąd podczas sprawdzania zaproszenia:", error);
    return false;
  }
};

//Sprawdzenie czy A nie otrzymał przypadkiem zaproszenia od B (aby nie renderować niepotrzebnie Dodaj do znajomych)
export const checkIsInvitedByUser = async (loggedUserId: string, profileUserName: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://localhost:7053/api/Notifications/by-user-id/${loggedUserId}`, {
      params: {
        type: "Invitation",
        noPagination: true,
        sourceUserName: profileUserName,  //Nazwa profilu który jest przeglądany
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    const notifications: Notification[] = response.data.data?.$values ?? [];
    return notifications.length > 0;
  } catch (error) {
    console.error("Błąd podczas sprawdzania zaproszenia:", error);
    return false;
  }
};

//Pobranie zaproszenia
export const getInvitationFromUser = async (
  loggedUserId: string,
  profileUserName: string
): Promise<Notification | null> => {
  try {
    const response = await axios.get(`https://localhost:7053/api/Notifications/by-user-id/${loggedUserId}`, {
      params: {
        type: "Invitation",
        noPagination: true,
        sourceUserName: profileUserName,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const notifications: Notification[] = response.data.data?.$values ?? [];
    return notifications.length > 0 ? notifications[0] : null;
  } catch (error) {
    console.error("Błąd podczas pobierania zaproszenia:", error);
    return null;
  }
};

//Usuwanie powiadomienia
export const deleteNotification = async (notificationId: string, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/Notifications/delete-notification/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.error("Błąd podczas usuwania powiadomienia:", err);
    setError("Nie udało się usunąć powiadomienia.");
  }
};

//Lista wszystkich powiadomień
export const fetchNotificationsByUserId = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
  orderBy: "date" | "type" = "date",
  sortDirection: "asc" | "desc" = "desc",
  isRead?: boolean,
  type?: NotificationType,
): Promise<PaginationResponse<Notification>> => {
  try {
    const response = await axios.get(`https://localhost:7053/api/Notifications/by-user-id/${userId}`, {
      params: {
        pageNumber,
        pageSize,
        orderBy,
        sortDirection,
        isRead,
        type,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

  return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        data: { $values: [] },
        totalItems: 0,
        pageNumber,
        pageSize,
        totalPages: 0,
      };
    }
  throw error;
  }
};

//Status odczytania powiadomienia
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.patch(
      `https://localhost:7053/api/Notifications/update-isread/${notificationId}`,
      {
        notificationId,
        isRead: true
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
  } catch (error) {
    console.error("Błąd podczas ustawiania powiadomienia jako przeczytane:", error);
    throw error;
  }
};

//Wysłanie powiadomienia po dodaniu komentarza do recenzji filmu
export const sendMovieReviewCommentedNotification = async (
  reviewId: string,
  targetUserId: string,
  sourceUserId: string,
  sourceUserName: string | null,
  setNotification: React.Dispatch<React.SetStateAction<any | null>>,
) => {
  const response = await axios.post(
    "https://localhost:7053/api/Notifications/add-notification",
    {
      title: `Komentarz do Twojej recenzji filmu`,
      description: `${sourceUserName} skomentował(a) Twoją recenzję filmu.`,
      type: "ReviewCommented",
      date: new Date().toISOString(),
      isRead: false,
      resource: `/${reviewId}/replies`,
      sourceUserId,
      targetUserId,
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
};

//Wysłanie powiadomienia po dodaniu komentarza do recenzji kolekcji filmowej
export const sendCollectionReviewCommentedNotification = async (
  collectionId: string,
  targetUserId: string,
  sourceUserId: string,
  sourceUserName: string | null,
  setNotification: React.Dispatch<React.SetStateAction<any | null>>,
) => {
  const response = await axios.post(
    "https://localhost:7053/api/Notifications/add-notification",
    {
      title: `Komentarz do Twojej recenzji kolekcji`,
      description: `${sourceUserName} skomentował(a) Twoją recenzję kolekcji filmów.`,
      type: "ReviewCommented",
      date: new Date().toISOString(),
      isRead: false,
      resource: `/movie-collection/${collectionId}/replies`,
      sourceUserId,
      targetUserId,
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
};

//Wysłanie powiadomienia po zrecenzowaniu kolekcji filmowej
export const sendCollectionReviewedNotification = async (
  collectionId: string,
  targetUserId: string,
  sourceUserId: string,
  sourceUserName: string | null,
  targetUserName: string | null,
  setNotification: React.Dispatch<React.SetStateAction<any | null>>,
) => {
  const response = await axios.post(
    "https://localhost:7053/api/Notifications/add-notification",
    {
      title: `Twoja kolekcja filmowa została zrecenzowana`,
      description: `${sourceUserName} napisał(a) recenzję Twojej kolekcji filmów.`,
      type: "CollectionReviewed",
      date: new Date().toISOString(),
      isRead: false,
      resource: `user/${targetUserName}/movieCollection/${collectionId}/reviews`,
      sourceUserId,
      targetUserId,
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
};
