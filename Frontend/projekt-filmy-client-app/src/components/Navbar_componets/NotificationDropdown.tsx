import { Link } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationCard from "../../components/Notifications_components/NotificationCard";

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
        {notifications.slice(0, 3).map((n) => (
            <li key={n.notificationId} className="dropdown-item p-0">
            <NotificationCard 
                notification={n} 
                onDelete={() => { fetchNotifications(pageInfo.pageNumber); }} 
            />
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