import React, { ReactNode, useEffect, useState } from "react";
import PaginationModule from "../PaginationModule";
import NotificationCard from "../../components/Notifications_components/NotificationCard"
import { useNotifications } from "../../hooks/useNotifications";

const NotificationPage = () => {
    const { notifications, pageInfo, fetchNotifications } = useNotifications();
    const [loading, setLoading] = useState(false);

    const handlePageChange = (page: number) => {
      fetchNotifications(page);
    };

    const handleDeleteNotification = () => {
      fetchNotifications(pageInfo.pageNumber);
    };
    

  return (
    <div className="container my-4">
      <h2 className="mb-4" style={{ color: "white" }}>
        Twoje powiadomienia
      </h2>
        {loading && <p>Ładowanie...</p>}
        {!loading && notifications.length === 0 && <p>Brak powiadomień.</p>}
        <div className="d-flex flex-column gap-3 mb-3">
            {notifications.map(notification => (
            <NotificationCard 
              key={notification.notificationId} 
              notification={notification} 
              onDelete={handleDeleteNotification} 
            />
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