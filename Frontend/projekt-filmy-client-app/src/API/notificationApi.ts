import axios from "axios";
import { Notification } from "../models/Notification";
import { NotificationType } from "../models/NotificationType";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { useApiQuery } from "../hooks/useApiQuery";
import { useApiMutation } from "../hooks/useApiMutation ";
import { API_BASE_URL } from "../constants/api";

export const useNotificationsByUserId = (userId: string, pageNumber: number, pageSize: number, orderBy: "date" | "type" = "date", sortDirection: "asc" | "desc" = "desc", isRead?: boolean, type?: NotificationType) => {
  return useApiQuery<{ notifications: Notification[]; totalPages: number }>({
    queryKey: ["notifications", userId, pageNumber, pageSize, orderBy, sortDirection, isRead, type],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Notifications/by-user-id/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              pageNumber,
              pageSize,
              orderBy,
              sortDirection,
              isRead,
              type,
            },
          }
        );
        return {
          notifications: data.data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err: any) {
        //404, pusta lista
        if (err.response?.status === 404) {
          return {
            notifications: [],
            totalPages: 0,
          };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: async (notificationId: string) => {
      await axios.delete(`${API_BASE_URL}/Notifications/delete-notification/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return notificationId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['invitation'] });
    }
  });
};

//Status odczytania powiadomienia
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: async (notificationId: string) => {
      await axios.patch(`${API_BASE_URL}/Notifications/update-isread/${notificationId}`, {
          notificationId,
          isRead: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return notificationId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

//Wysłanie powiadomienia po dodaniu komentarza do recenzji filmu
export const useSendMovieReviewCommentedNotification = () => {
  return useApiMutation({
    mutationFn: async ({ reviewId, targetUserId, sourceUserId, sourceUserName }: { reviewId: string; targetUserId: string; sourceUserId: string; sourceUserName: string | null; }) => {
      const response = await axios.post(`${API_BASE_URL}/Notifications/add-notification`, {
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
      return response.data;
    }
  });
};

//Wysłanie powiadomienia po dodaniu komentarza do recenzji kolekcji filmowej
export const useSendCollectionReviewCommentedNotification = () => {
  return useApiMutation({
    mutationFn: async ({ collectionId, targetUserId, sourceUserId, sourceUserName }: { collectionId: string; targetUserId: string; sourceUserId: string; sourceUserName: string | null }) => {
      const response = await axios.post(`${API_BASE_URL}/Notifications/add-notification`, {
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
      return response.data;
    }
  });
};

export const useSendCollectionReviewedNotification = () => {
  return useApiMutation({
    mutationFn: async ({ collectionId, targetUserId, sourceUserId, sourceUserName, targetUserName }: { collectionId: string; targetUserId: string; sourceUserId: string; sourceUserName: string | null; targetUserName: string | null; }) => {
      const response = await axios.post(`${API_BASE_URL}/Notifications/add-notification`, {
          title: `Twoja kolekcja filmowa została zrecenzowana`,
          description: `${sourceUserName} napisał(a) recenzję Twojej kolekcji filmów.`,
          type: "CollectionReviewed",
          date: new Date().toISOString(),
          isRead: false,
          resource: `/user/${targetUserName}/movieCollection/${collectionId}/reviews`,
          sourceUserId,
          targetUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    }
  });
};

export const useSendFriendInvitation = () => {
  return useApiMutation({
    mutationFn: async ({ targetUserId, sourceUserId, sourceUserName }: { targetUserId: string; sourceUserId: string; sourceUserName: string | null; }) => {
      const response = await axios.post(`${API_BASE_URL}/Notifications/add-notification`, {
          title: `Zaproszenie do grona znajomych!`,
          description: `${sourceUserName} zaprasza Cię do grona znajomych!`,
          type: "Invitation",
          date: new Date().toISOString(),
          isRead: false,
          resource: `/user/${sourceUserName}`,
          sourceUserId,
          targetUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    },
  });
};

//Sprawdzenie czy A nie otrzymał przypadkiem zaproszenia od B (aby nie renderować niepotrzebnie Dodaj do znajomych)
//Mozna by to jeszcze sprobowac przerzucić do backendu i próbować wypluwać jako role Pending
export const useCheckIsInvitedByUser = (loggedUserId: string | null, profileUserName: string) => {
  return useApiQuery({
    queryKey: ["invitation", loggedUserId, profileUserName],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Notifications/by-user-id/${loggedUserId}`, {
        params: {
          type: "Invitation",
          noPagination: true,
          sourceUserName: profileUserName,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const notifications = data.data?.$values ?? [];
      return notifications.length > 0;
    },
    enabled: !!loggedUserId && !!profileUserName,
  });
};