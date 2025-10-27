import { useState, useEffect } from "react";
import homeIcon from "../../imgs/home_icon.png";
import { Link } from "react-router-dom";
import LoginModal from "../SingIn_SignUp_componets/LoginModal";
import RegistrationModal from "../SingIn_SignUp_componets/RegistrationModal";
import NotificationDropdown from "../../components/Navbar_componets/NotificationDropdown";

const NavBar = () => {
  const [isLoginModalVisable, setIsLoginModalVisable] = useState(false);
  const [isRegisterModalVisable, setIsRegisterModalVisable] = useState(false);
  const [loggedUsername, setLoggedUsername] = useState<string | null>(localStorage.getItem("logged_username"));

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem("logged_username", username);
    localStorage.setItem("lastLocation", window.location.pathname);
    setLoggedUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("logged_username");
    localStorage.removeItem("token");
    setLoggedUsername(null);
  };

  useEffect(() => {
    const handleUserUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ username: string }>;
      setLoggedUsername(customEvent.detail.username);
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const handleCollapse = () => {
    const collapse = document.getElementById("navbarCollapse");
    collapse?.classList.remove("show");
  };

  const navLinks = [
    { label: "Filmy", link: "search-movies" },
    { label: "Reżyserzy", link: "search-directors" },
    { label: "Aktorzy", link: "search-actors" },
    { label: "Osiągnięcia", link: "/achievements" },
  ];

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "1px solid transparent",
    color: "white",
    padding: "10px 12px",
    borderRadius: "10px",
    margin: "5px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
  };

return (
  <>
    <nav
      className="navbar px-4 jersey-15-regular"
      style={{
        minHeight: "80px",
        minWidth: "70%",
        maxWidth: "70%",
        backgroundColor: "#150021",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center d-lg-none w-100 justify-content-between">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-light me-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <Link to="" className="d-flex align-items-center me-2" onClick={handleCollapse}>
              <img
                src={homeIcon}
                alt="home"
                style={{ width: "20px", height: "20px", filter: "invert(1)" }}
              />
            </Link>
          </div>

          <div className="d-flex align-items-center">
            <div onClick={handleCollapse}>
              <NotificationDropdown />
            </div>

            {loggedUsername ? (
              <div className="dropdown ms-2">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={handleCollapse}
                >
                  {loggedUsername}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/user/${loggedUsername}`}
                      onClick={handleCollapse}
                    >
                      Profil
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/user/achievements/${loggedUsername}`}
                      onClick={handleCollapse}
                    >
                      Osiągnięcia
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`users/statistics/${loggedUsername}`}
                      onClick={handleCollapse}
                    >
                      Statystyki
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/user/${loggedUsername}/friends`}
                      onClick={handleCollapse}
                    >
                      Znajomi
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/user/${loggedUsername}/blocked`}
                      onClick={handleCollapse}
                    >
                      Zablokowani
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleLogout();
                        handleCollapse();
                      }}
                    >
                      Wyloguj
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-light mx-2"
                  onClick={() => {
                    setIsLoginModalVisable(true);
                    handleCollapse();
                  }}
                >
                  Zaloguj
                </button>
                <button
                  className="btn btn-outline-light mx-2"
                  onClick={() => {
                    setIsRegisterModalVisable(true);
                    handleCollapse();
                  }}
                >
                  Zarejestruj
                </button>
              </>
            )}
          </div>
        </div>

        <div className="d-none d-lg-flex w-100 justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="">
              <img
                src={homeIcon}
                alt="home"
                style={{ width: "20px", height: "20px", filter: "invert(1)" }}
              />
            </Link>
          </div>

          <div className="d-flex justify-content-center">
            {navLinks.map(({ label, link }) => (
              <Link
                key={link}
                to={link}
                style={buttonStyle}
                className="nav-button"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="d-flex align-items-center">
            <NotificationDropdown />
            {loggedUsername ? (
              <div className="dropdown ms-2">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="userDropdownDesktop"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {loggedUsername}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdownDesktop"
                >
                  <li><Link className="dropdown-item" to={`/user/${loggedUsername}`}>Profil</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to={`/user/achievements/${loggedUsername}`}>Osiągnięcia</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to={`users/statistics/${loggedUsername}`}>Statystyki</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to={`/user/${loggedUsername}/friends`}>Znajomi</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to={`/user/${loggedUsername}/blocked`}>Zablokowani</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Wyloguj</button></li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-light mx-2"
                  onClick={() => setIsLoginModalVisable(true)}
                >
                  Zaloguj
                </button>
                <button
                  className="btn btn-outline-light mx-2"
                  onClick={() => setIsRegisterModalVisable(true)}
                >
                  Zarejestruj
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className="collapse navbar-collapse flex-column"
          id="navbarCollapse"
          style={{
            backgroundColor: "#150021",
            zIndex: 1050,
            position: "absolute",
            left: 0,
            right: 0,
            top: "80px",
          }}
        >
          <div className="d-flex flex-column w-100 justify-content-center align-items-center">
            {navLinks.map(({ label, link }) => (
              <Link
                key={link}
                to={link}
                onClick={handleCollapse}
                style={buttonStyle}
                className="nav-button"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>

    <LoginModal
      show={isLoginModalVisable}
      onClose={() => setIsLoginModalVisable(false)}
      onLoginSuccess={handleLoginSuccess}
    />
    <RegistrationModal
      show={isRegisterModalVisable}
      onClose={() => setIsRegisterModalVisable(false)}
      onRegisterSuccess={handleLoginSuccess}
    />

<style>
  {`
    .nav-button:hover {
      background-color: white !important;
      color: #212529 !important;
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      .dropdown-menu {
        transform: translateX(-50%) !important;
        right: auto !important;
      }
    }
  `}
</style>

  </>
);

};

export default NavBar;
