import { Link } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";

const NotificationDropdown = () => {
  const { notifications, hasNew, setHasNew } = useNotifications();

  return (
    <div className="dropdown mx-2">
      <button
        className="btn btn-outline-light position-relative"
        type="button"
        id="notificationsDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        title="Powiadomienia"
        onClick={() => setHasNew(false)}
      >
        <i className={hasNew ? "bi bi-bell-fill" : "bi bi-bell"}></i>
        {hasNew && (
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ fontSize: "0.6rem" }}
          ></span>
        )}
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="notificationsDropdown"
        style={{ minWidth: "280px" }}
      >
        {notifications.slice(0, 3).map((n) => (
        <li key={n.notificationId} className="dropdown-item">
            <div className="fw-bold">{n.title}</div>
            <div className="small text-muted">{n.description}</div>
        </li>
        ))}
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