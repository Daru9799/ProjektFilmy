import React, { ReactNode, useEffect, useState } from "react";
import PaginationModule from "../PaginationModule";
import { fetchNotificationsByUserId } from "../../API/notificationApi"
import { PaginationResponse } from "../../API/PaginationResponse"
import { Notification  } from "../../models/Notification";
import { decodeJWT } from "../../hooks/decodeJWT";
import NotificationCard from "../../components/Notifications_components/NotificationCard"
import * as signalR from "@microsoft/signalr";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [pageInfo, setPageInfo] = useState({
        totalItems: 0,
        pageNumber: 1,
        pageSize: 5,
        totalPages: 1,
    });
    const [loading, setLoading] = useState(false);

    const loggedUsername = localStorage.getItem("logged_username");

    const fetchNotifications = async (page: number) => {
        if (!loggedUsername) return;
        const token = localStorage.getItem("token");
        
            if (!token) {
              console.error("Token nie jest dostępny.");
              return;
            }
        
            const decodedToken = decodeJWT(token);
            const loggedUserId = decodedToken.nameid;
        setLoading(true);
        try {
        const data: PaginationResponse<Notification> = await fetchNotificationsByUserId(loggedUserId, page, 5);

        setNotifications(data.data.$values);
        setPageInfo({
            totalItems: data.totalItems,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
        });
        } catch (error) {
        console.error("Błąd podczas pobierania powiadomień:", error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(pageInfo.pageNumber);
    }, [pageInfo.pageNumber]);

    //SingalR
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

        if (pageInfo.pageNumber === 1) {
            setNotifications((prev) => [notification, ...prev.slice(0, pageInfo.pageSize - 1)]);
        }

        setPageInfo((prev) => ({
            ...prev,
            totalItems: prev.totalItems + 1,
        }));
        });

        return () => {
        connection.stop();
        };
    }, [pageInfo.pageNumber]);

    const handlePageChange = (page: number) => {
        setPageInfo((prev) => ({ ...prev, pageNumber: page }));
    };

  return (
    <div className="container my-4">
      <h2 className="mb-4" style={{ color: "white" }}>
        Twoje powiadomienia
      </h2>
        {loading && <p>Ładowanie...</p>}
        {!loading && notifications.length === 0 && <p>Brak powiadomień.</p>}
        <div className="d-flex flex-column gap-3 mb-3">
            {notifications.map((n) => (
                <NotificationCard key={n.notificationId} notification={n} />
            ))}
        </div>

      {/* Komponent paginacji */}
      <div className="mt-auto">
        <PaginationModule
          currentPage={pageInfo.pageNumber}
          totalPages={pageInfo.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NotificationPage;