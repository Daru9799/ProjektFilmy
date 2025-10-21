import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Notification } from "../../models/Notification";
import { useNotificationsByUserId } from "../../API/NotificationApi";
import { getLoggedUserId } from "../../hooks/decodeJWT";
import * as signalR from "@microsoft/signalr";
import { useRef } from "react";

interface NotificationContextProps {
  hasNew: boolean;
  setHasNew: (val: boolean) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [hasNew, setHasNew] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const userId = getLoggedUserId();

  //Api
  const { refetch } = useNotificationsByUserId(userId ?? "", 1, 3);

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
      refetch(); //Aktualizacja powiadomien w dzwonku
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
    <NotificationContext.Provider value={{ hasNew, setHasNew}}>
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