import { Link } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationDropdownItem from "../../components/Navbar_componets/NotificationListItem";

const NotificationDropdown = () => {
    const { notifications, hasNew, setHasNew, fetchNotifications, pageInfo } = useNotifications();

  const handleOpenDropdown = () => {
    setHasNew(false);
    fetchNotifications(pageInfo.pageNumber);
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
          {notifications.length === 0 ? (
            <div className="list-group-item text-center text-muted py-3">
              Brak powiadomień
            </div>
          ) : (
            notifications.slice(0, 3).map((n, idx, arr) => (
              <NotificationDropdownItem
                key={n.notificationId}
                notification={n}
                onDelete={() => fetchNotifications(pageInfo.pageNumber)}
                isLast={idx === arr.length - 1}
              />
            ))
          )}
        </div>
        <li>
            <hr className="dropdown-divider" />
        </li>
        <li>
            <Link to="/notifications" className="dropdown-item text-center">
            Zobacz wszystkie
            </Link>
        </li>
    </ul>
    </div>
  );
};

export default NotificationDropdown;