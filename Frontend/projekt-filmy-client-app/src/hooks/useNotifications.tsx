import { useEffect, useState, useCallback } from "react";
import { Notification } from "../models/Notification";
import { fetchNotificationsByUserId } from "../API/notificationApi";
import { decodeJWT } from "./decodeJWT";
import * as signalR from "@microsoft/signalr";
import { PaginationResponse } from "../API/PaginationResponse";
import { useNavigate } from "react-router-dom";

export const useNotifications = (initialPage = 1, pageSize = 5) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const navigate = useNavigate();
  
  const [pageInfo, setPageInfo] = useState({
    totalItems: 0,
    pageNumber: initialPage,
    pageSize: pageSize,
    totalPages: 1,
  });

  const fetchNotifications = useCallback(async (page: number) => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("logged_username");
    if (!token || !username) 
    {
      navigate("/");
      return;
    }

    const decodedToken = decodeJWT(token);
    const userId = decodedToken.nameid;

    try {
      const data: PaginationResponse<Notification> = await fetchNotificationsByUserId(userId, page, pageSize);
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
  }, [pageSize]);

  useEffect(() => {
    fetchNotifications(pageInfo.pageNumber);
  }, [fetchNotifications, pageInfo.pageNumber]);

  // SignalR
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
        setNotifications((prev) => [notification, ...prev.slice(0, pageSize - 1)]);
      }

      setPageInfo((prev) => ({
        ...prev,
        totalItems: prev.totalItems + 1,
      }));
    });

    return () => {
      connection.stop().then(() => {
        console.log("Rozłączono z SignalR");
      }).catch((err) => {
        console.error("Błąd rozłączania z SignalR:", err);
      });
    };
  }, [pageInfo.pageNumber, pageSize]);

  return {
    notifications,
    hasNew,
    pageInfo,
    fetchNotifications,
    setHasNew,
  };
};