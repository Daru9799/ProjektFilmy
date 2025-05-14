import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Notification {
  notificationId: string;
  title: string;
  description: string;
  type: string;
  date: string;
  isRead: boolean;
  resource: string;
  sourceUserId: string;
  sourceUserName: string;
}

const NotificationTestPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Brak tokenu! Nie połączysz sie z SignalR.");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7053/notificationHub", {
      accessTokenFactory: () => token || ""
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

    connection.start()
      .then(() => {
        console.log("Połączono z SignalR");
      })
      .catch(err => console.error("Błąd połączenia z SignalR:", err));

    connection.on("ReceiveNotification", (notification: Notification) => {
      console.log("Otrzymano powiadomienie:", notification);
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          backgroundImage: "url('/imgs/cinema-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          width: "100%",
        }}
        className="d-flex justify-content-center align-items-center"
      ></div>

      <div
        className="container-sm text-white py-3"
        style={{ backgroundColor: "#1A075A" }}
      >
        <h1 className="jersey-15-regular">Test Powiadomień</h1>
        <p>
          Strona do testowania powiadomień. Aby przetestować należy się zalogować na dowolne konto i odpalić 
          /api/Notifications/add-notification na tego usera z backendu.
        </p>
      </div>

      <div className="container mt-4">
        <h2 className="text-white mb-3">Odebrane powiadomienia:</h2>
        {notifications.length === 0 ? (
          <p className="text-white">Brak powiadomień</p>
        ) : (
          notifications.map(n => (
            <div key={n.notificationId} className="alert alert-info">
              <strong>{n.title}</strong><br />
              {n.description}<br />
              <small>{new Date(n.date).toLocaleString()} | Typ: {n.type}</small><br />
              <small>Od: {n.sourceUserName}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTestPage;