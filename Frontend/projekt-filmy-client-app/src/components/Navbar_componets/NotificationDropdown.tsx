import { Link } from "react-router-dom";
import NotificationDropdownItem from "../../components/Navbar_componets/NotificationListItem";
import { useNotificationContext } from "../../components/Notifications_components/NotificationsContext";

const NotificationDropdown = () => {
  const { latestNotifications, hasNew, setHasNew, fetchLatestNotifications } = useNotificationContext();

  const handleOpenDropdown = () => {
    setHasNew(false);
    fetchLatestNotifications()
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
          {latestNotifications.length === 0 ? (
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