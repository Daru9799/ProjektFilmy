import { ReactNode, useEffect, useState } from "react";
import NotificationCard from "../components/Notifications_components/NotificationCard"
import PaginationModule from "../components/SharedModals/PaginationModule";
import { useNotificationContext } from "../components/Notifications_components/NotificationsContext";
import { useNavigate, useLocation } from "react-router-dom";
import InfoModal from "../components/SharedModals/InfoModal";
import SortNotificationModule from "../components/Notifications_components/SortNotificationModule"
import { readFilterMap, ReadFilterOption, NotificationTypeFilterOption } from "../components/Notifications_components/SortNotificationModule";

const NotificationPage = () => {
    const { notifications, fetchNotifications, pageInfo, filters, setFilters } = useNotificationContext();
    const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shouldReset = searchParams.get("reset") === "true";

    const handlePageChange = (page: number) => {
      fetchNotifications(page);
    };

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token nie jest dostępny.");
        setShowUnauthorizedModal(true);
        return;
      }
    });

    useEffect(() => {
      fetchNotifications(1, filters.orderBy, filters.sortDirection, filters.isRead, filters.notificationType);
    }, [filters]);

    useEffect(() => {
      if (shouldReset) {
        setFilters({
          orderBy: "date",
          sortDirection: "desc",
          isRead: undefined,
          notificationType: undefined,
        });
      }
    }, [shouldReset]);

    const handleCloseUnauthorizedModal = () => {
      setShowUnauthorizedModal(false);
      navigate("/");
    };

    const handleSort = (newOrderBy: "date" | "type", newSortDirection: "asc" | "desc", readFilter: ReadFilterOption = "all", typeFilter: NotificationTypeFilterOption = "all") => {
      const newFilters = { orderBy: newOrderBy, sortDirection: newSortDirection, isRead: readFilterMap[readFilter], notificationType: typeFilter === "all" ? undefined : typeFilter,};
      setFilters(newFilters);
    };

  return (
    <div className="container my-4" style={{ minHeight: "90vh"}}>
      <h2 className="mb-4" style={{ color: "white" }}>
        Twoje powiadomienia
      </h2>
      <SortNotificationModule onSort={handleSort} />
        {loading && <p>Ładowanie...</p>}
        {!loading && notifications.length === 0 && <h3 style={{ color: "white" }}>Brak powiadomień.</h3>}
        <div className="d-flex flex-column gap-3 mb-3 mt-3">
            {notifications.map(notification => (
            <NotificationCard 
              key={notification.notificationId} 
              notification={notification}
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

      {/* Modal informujący o braku zalogowania */}
      <InfoModal
        show={showUnauthorizedModal}
        onClose={handleCloseUnauthorizedModal}
        title="Brak dostępu"
        message="Musisz być zalogowany, aby zobaczyć swoje powiadomienia."
        variant="danger"
      />
    </div>
  );
};

export default NotificationPage;