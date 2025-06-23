import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Notification } from "../../models/Notification";
import { NotificationType } from "../../models/NotificationType";
import { fetchNotificationsByUserId, deleteNotification } from "../../API/notificationApi";
import { getLoggedUserId } from "../../hooks/decodeJWT";
import * as signalR from "@microsoft/signalr";
import { PaginationResponse } from "../../API/PaginationResponse";
import { useRef } from "react";

interface NotificationContextProps {
  notifications: Notification[];
  latestNotifications: Notification[];
  hasNew: boolean;
  setHasNew: (val: boolean) => void;
  fetchNotifications: (page?: number, orderBy?: "date" | "type", sortDirection?: "asc" | "desc", isRead?: boolean, notificationType?: NotificationType) => Promise<void>;
  fetchLatestNotifications: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  pageInfo: {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  filters: NotificationFilters;
  setFilters: React.Dispatch<React.SetStateAction<NotificationFilters>>;
}

type NotificationFilters = {
  orderBy: "date" | "type";
  sortDirection: "asc" | "desc";
  isRead?: boolean;
  notificationType?: NotificationType;
};

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]); //Lista dla strony z powiadomieniami
  const [latestNotifications, setLatestNotifications] = useState<Notification[]>([]); //Lista dla navbaru
  const [hasNew, setHasNew] = useState(false);
  const [pageInfo, setPageInfo] = useState({totalItems: 0, pageNumber: 1, pageSize: 6, totalPages: 1});
  const [filters, setFilters] = useState<{orderBy: "date" | "type"; sortDirection: "asc" | "desc"; isRead?: boolean; notificationType?: NotificationType;}>({orderBy: "date", sortDirection: "desc",});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const fetchLatestNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("logged_username");
    if (!token || !username) return;

    const userId = getLoggedUserId();
    if(!userId) return;

    try {
      const data: PaginationResponse<Notification> = await fetchNotificationsByUserId(userId, 1, 3, "date", "desc");
      setLatestNotifications(data.data.$values);
    } catch (err) {
      console.error("Błąd pobierania najnowszych powiadomień:", err);
    }
  }, []);

  const fetchNotifications = useCallback(async (page: number = 1, orderBy = filters.orderBy, sortDirection = filters.sortDirection, isRead = filters.isRead, notificationType = filters.notificationType) => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("logged_username");
    if (!token || !username) return;

    const userId = getLoggedUserId();
    if(!userId) return;

    try {
      const data: PaginationResponse<Notification> = await fetchNotificationsByUserId(userId, page, pageInfo.pageSize, orderBy, sortDirection, isRead, notificationType);
      setNotifications(data.data.$values);
      setPageInfo({
        totalItems: data.totalItems,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error("Błąd pobierania powiadomień:", err);
    }
  }, [pageInfo.pageSize, filters]);

  const removeNotification = async (id: string) => {
    try {
      setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
      setLatestNotifications((prev) => prev.filter((n) => n.notificationId !== id));
      setPageInfo((prev) => ({
        ...prev,
        totalItems: Math.max(0, prev.totalItems - 1),
      }));
      await fetchNotifications();
      await fetchLatestNotifications();
    } catch (err) {
      console.error("Błąd usuwania powiadomienia:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (connectionRef.current) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7053/notificationHub", {
        accessTokenFactory: () => token,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => console.log("Połączono z SignalR"))
      .catch((err) => console.error("Błąd połączenia z SignalR:", err));

    connection.on("ReceiveNotification", (notification: Notification) => {
      console.log("Otrzymano powiadomienie:", notification);
      setHasNew(true);

      // if (pageInfo.pageNumber === 1) {
      //   fetchNotifications(); //Na razie wyłączona aktualizacja powiadomień na stronie
      // }

      setLatestNotifications((prev) => [notification, ...prev.slice(0, 2)]);

      setPageInfo((prev) => ({
        ...prev,
        totalItems: prev.totalItems + 1,
      }));
    });

    return () => {
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => console.log("Rozłączono z SignalR"))
          .catch((err) => console.error("Błąd rozłączania z SignalR:", err));
        connectionRef.current = null;
      }
    };
  }, []);


  return (
    <NotificationContext.Provider value={{ notifications, latestNotifications, hasNew, setHasNew, fetchNotifications, fetchLatestNotifications, removeNotification, pageInfo, filters, setFilters}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }
  return context;
};