import { ReactNode, useEffect, useState } from "react";
import NotificationCard from "../../components/Notifications_components/NotificationCard"
import PaginationModule from "../SharedModals/PaginationModule";
import { useNotificationContext } from "../../components/Notifications_components/NotificationsContext";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import SortNotificationModule from "../../components/Notifications_components/SortNotificationModule"
import type { ReadFilterOption, NotificationTypeFilterOption } from "../../components/Notifications_components/SortNotificationModule";
import { readFilterMap } from "../../components/Notifications_components/SortNotificationModule";

const NotificationPage = () => {
    const { notifications, fetchNotifications, pageInfo } = useNotificationContext();
    const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderBy, setOrderBy] = useState<"date" | "type">("date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [isReadFilter, setReadFilter] = useState<ReadFilterOption>("all");
    const [typeFilter, setTypeFilter] = useState<NotificationTypeFilterOption>("all");
    const navigate = useNavigate();

    const handlePageChange = (page: number) => {
      const typeParam = typeFilter === "all" ? undefined : typeFilter;
      fetchNotifications(page, orderBy, sortDirection, readFilterMap[isReadFilter], typeParam);
    };

    const handleDeleteNotification = () => {
      const typeParam = typeFilter === "all" ? undefined : typeFilter;
      fetchNotifications(pageInfo.pageNumber, orderBy, sortDirection, readFilterMap[isReadFilter], typeParam);
    };

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token nie jest dostępny.");
        setShowUnauthorizedModal(true);
        return;
      }
    });

    const handleCloseUnauthorizedModal = () => {
      setShowUnauthorizedModal(false);
      navigate("/");
    };

    const handleSort = (newOrderBy: "date" | "type", newSortDirection: "asc" | "desc", filter: ReadFilterOption = "all", typeFilter: NotificationTypeFilterOption = "all") => {
      setOrderBy(newOrderBy);
      setSortDirection(newSortDirection);
      setReadFilter(filter);
      setTypeFilter(typeFilter);
      const typeParam = typeFilter === "all" ? undefined : typeFilter;

      fetchNotifications(1, newOrderBy, newSortDirection, readFilterMap[filter], typeParam);
    };

  return (
    <div className="container my-4">
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

      {/* Modal informujący o braku zalogowania */}
      <Modal show={showUnauthorizedModal} onHide={handleCloseUnauthorizedModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Brak dostępu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ fontWeight: "bold", color: "red" }}>
            Musisz być zalogowany, aby zobaczyć swoje powiadomienia.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseUnauthorizedModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationPage;