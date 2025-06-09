import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Notification } from "../../models/Notification";
import { fetchNotificationsByUserId } from "../../API/notificationApi";
import { decodeJWT } from "../../hooks/decodeJWT";
import * as signalR from "@microsoft/signalr";
import { PaginationResponse } from "../../API/PaginationResponse";

interface NotificationContextProps {
  notifications: Notification[];
  hasNew: boolean;
  setHasNew: (val: boolean) => void;
  fetchNotifications: (page: number) => Promise<void>;
  pageInfo: {
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const fetchNotifications = useCallback(async (page: number = 1) => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("logged_username");
    if (!token || !username) 
    {
        return;
    }

    const decodedToken = decodeJWT(token);
    const userId = decodedToken.nameid;

    try {
      const data: PaginationResponse<Notification> = await fetchNotificationsByUserId(userId, page, pageInfo.pageSize);
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
  }, [pageInfo.pageSize]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) 
    {
        return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7053/notificationHub", {
        accessTokenFactory: () => token,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => console.log("Połączono z SignalR"))
      .catch((err) => console.error("Błąd połączenia z SignalR:", err));

    connection.on("ReceiveNotification", (notification: Notification) => {
      console.log("Otrzymano powiadomienie:", notification);
      setHasNew(true);
      if (pageInfo.pageNumber === 1) {
        setNotifications((prev) => [notification, ...prev.slice(0, pageInfo.pageSize - 1)]);
      }
      setPageInfo((prev) => ({
        ...prev,
        totalItems: prev.totalItems + 1,
      }));
    });

    return () => {
      connection
        .stop()
        .then(() => console.log("Rozłączono z SignalR"))
        .catch((err) => console.error("Błąd rozłączania z SignalR:", err));
    };
  }, [pageInfo.pageNumber, pageInfo.pageSize]);

  useEffect(() => {
    fetchNotifications(pageInfo.pageNumber);
  }, [fetchNotifications, pageInfo.pageNumber]);

  return (
    <NotificationContext.Provider value={{ notifications, hasNew, setHasNew, fetchNotifications, pageInfo }}>
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