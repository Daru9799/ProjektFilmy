import { useEffect, useState } from "react";
import NotificationCard from "../components/Notifications_components/NotificationCard"
import PaginationModule from "../components/SharedModals/PaginationModule";
import { useNavigate, useLocation } from "react-router-dom";
import InfoModal from "../components/SharedModals/InfoModal";
import SortNotificationModule from "../components/Notifications_components/SortNotificationModule"
import { readFilterMap, ReadFilterOption, NotificationTypeFilterOption } from "../components/Notifications_components/SortNotificationModule";
import { getLoggedUserId } from "../hooks/decodeJWT";
import { useNotificationsByUserId } from "../API/NotificationApi";
import SpinnerLoader from "../components/SpinnerLoader";
import { NotificationType } from "../models/NotificationType";
import { useNotificationContext } from "../components/Notifications_components/NotificationsContext";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

const NotificationPage = () => {
    const { hasNew, setHasNew  } = useNotificationContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<{orderBy: "date" | "type"; sortDirection: "asc" | "desc"; isRead?: boolean; notificationType?: NotificationType;}>({orderBy: "date", sortDirection: "desc",});
    const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shouldReset = searchParams.get("reset") === "true";
    const userId = getLoggedUserId();
  
    //Hook
    const { data: notificationsData, isLoading: notificationLoading, apiError: notificationError, refetch: refetchNofiticationsData } = useNotificationsByUserId(userId ?? "", currentPage, 6, filters.orderBy, filters.sortDirection, filters.isRead, filters.notificationType);
    const notifications = notificationsData?.notifications ?? [];
    const totalPages = notificationsData?.totalPages ?? 1;

    const handlePageChange = (page: number) => setCurrentPage(page);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token nie jest dostępny.");
        setShowUnauthorizedModal(true);
        return;
      }
    });

    //W przypadku gdy signalR otrzyma powiadomienie, zrobi refetch'a (gdy jestesmy na stronie z notifications zdejmuje setHasNew aby zapobiedz kolizji)
    useEffect(() => {
      refetchNofiticationsData();
      setHasNew(false);
    }, [hasNew])

    //Przejście po filtrach do 1 strony
    useEffect(() => {
      setCurrentPage(1);
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

    if(notificationLoading) return <SpinnerLoader />

  return (
    <div className="container my-4" style={{ minHeight: "90vh"}}>
      <ApiErrorDisplay apiError={notificationError}>
      <h2 className="mb-4" style={{ color: "white" }}>
        Twoje powiadomienia
      </h2>
      <SortNotificationModule onSort={handleSort} />
        {!notificationLoading && notifications.length === 0 && <h3 className="py-4" style={{ color: "white" }}>Brak powiadomień.</h3>}
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
        {notifications.length !== 0 && <PaginationModule
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />}
      </div>

      {/* Modal informujący o braku zalogowania */}
      <InfoModal
        show={showUnauthorizedModal}
        onClose={handleCloseUnauthorizedModal}
        title="Brak dostępu"
        message="Musisz być zalogowany, aby zobaczyć swoje powiadomienia."
        variant="danger"
      />
      </ApiErrorDisplay>
    </div>
  );
};

export default NotificationPage;