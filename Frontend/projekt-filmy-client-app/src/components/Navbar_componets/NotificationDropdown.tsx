import { Link } from "react-router-dom";
import NotificationDropdownItem from "../../components/Navbar_componets/NotificationListItem";
import { useNotificationContext } from "../../components/Notifications_components/NotificationsContext";
import { getLoggedUserId } from "../../hooks/decodeJWT";
import { useNotificationsByUserId } from "../../API/NotificationApi";
import SpinnerLoader from "../SpinnerLoader";
import ApiErrorDisplay from "../ApiErrorDisplay";

const NotificationDropdown = () => {
  const { hasNew, setHasNew } = useNotificationContext();
  const userId = getLoggedUserId();
  //Api
  const { data: notificationsData, isLoading: loadingNotificationsData, apiError: notificationsDataError } = useNotificationsByUserId(userId ?? "", 1, 3);
  const latestNotifications = notificationsData?.notifications ?? [];

  const handleOpenDropdown = () => {
    setHasNew(false);
  };

  return (
    <div className="dropdown mx-2">
      <button
        className="btn btn-outline-light position-relative"
        type="button"
        id="notificationsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Powiadomienia"
        onClick={handleOpenDropdown}
      >
        <i className={hasNew ? "bi bi-bell-fill" : "bi bi-bell"}></i>
        {hasNew && (
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ fontSize: "0.6rem" }}
          ></span>
        )}
      </button>

    <ul className="dropdown-menu dropdown-menu-end " aria-labelledby="notificationsDropdown" style={{ minWidth: "300px", fontFamily: "'Arial', sans-serif" }}>
        <div className="list-group list-group-flush">
          {loadingNotificationsData ? (
            <div className="list-group-item text-center py-3">
              <SpinnerLoader />
            </div>
          ) : notificationsDataError ? (
            <div className="list-group-item text-center text-danger py-3">
              <ApiErrorDisplay apiError={notificationsDataError} />
            </div>
          ) : latestNotifications.length === 0 ? (
            <div className="list-group-item text-center text-muted py-3">
              Brak powiadomień
            </div>
          ) : (
            latestNotifications.slice(0, 3).map((n, idx, arr) => (
              <NotificationDropdownItem
                key={n.notificationId}
                notification={n}
                isLast={idx === arr.length - 1}
              />
            ))
          )}
        </div>
        <li>
            <hr className="dropdown-divider" />
        </li>
        <li>
            <Link to="/notifications?reset=true" className="dropdown-item text-center">
              Zobacz wszystkie
            </Link>
        </li>
    </ul>
    </div>
  );
};

export default NotificationDropdown;