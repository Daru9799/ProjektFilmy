import { useState, useEffect } from "react";
import homeIcon from "../../imgs/home_icon.png";
import NavTile from "./NavTile";
import { Link } from "react-router-dom";
import LoginModal from "../SingIn_SignUp_componets/LoginModal";
import RegistrationModal from "../SingIn_SignUp_componets/RegistrationModal";

const NavBar = () => {
  const [isLoginModalVisable, setIsLoginModalVisable] = useState(false);
  const [isRegisterModalVisable, setIsRegisterModalVisable] = useState(false);
  const [loggedUsername, setLoggedUsername] = useState<string | null>(localStorage.getItem("logged_username"));

  // Zaktualizuj stan po zalogowaniu
  const handleLoginSuccess = (username: string) => {
    localStorage.setItem("logged_username", username);
    localStorage.setItem("lastLocation", window.location.pathname);
    window.location.reload();
    setLoggedUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("logged_username");
    localStorage.removeItem("token");
    setLoggedUsername(null);
    window.location.reload();
  };

  //nasłuchiwanie zmian w localStorage
  useEffect(() => {
    const handleUserUpdate = (event: Event) => {
        const customEvent = event as CustomEvent<{ username: string }>;
        setLoggedUsername(customEvent.detail.username);
    };

    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
        window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  return (
    <>
      <nav className="NavBar navbar-expand-lg text-white px-4 jersey-15-regular" style={{ minHeight: "80px", minWidth: "70%", maxWidth: "70%" }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ">
            <button className="btn btn-light me-2">
              <Link to="">
                <img src={homeIcon} alt="" style={{ width: "20px", height: "20px" }} />
              </Link>
            </button>
            <NavTile link="search-movies">Filmy</NavTile>
            <NavTile link="search-directors">Reżyserzy</NavTile>
            <NavTile link="search-actors">Aktorzy</NavTile>
            <NavTile link="notifications">Test powiadomień</NavTile>
            <NavTile link="/achievements">Osiągnięcia</NavTile>
          </div>

          <div className="d-flex align-items-center">
            {loggedUsername ? (
              <>
                {/* Rozwijane menu - dostępne po zalogowaniu */}
                <div className="dropdown mx-2">
                  <button
                    className="btn btn-light dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {loggedUsername}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to={`/user/${loggedUsername}`}>
                        Profil
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                      <li>
                      <Link className="dropdown-item" to={`/user-achievements/${loggedUsername}`}>
                        Osiągnięcia
                      </Link>
                    </li>
                          <hr className="dropdown-divider" />
                      <li>
                      <Link className="dropdown-item" to={`users/statistics/${loggedUsername}`}>
                        Statystyki
                      </Link>
                    </li>
                        <hr className="dropdown-divider" />
                      <li>
                      <Link className="dropdown-item" to={`users/moviecollection/create`}>
                        Utwórz kolekcję
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to={`/user/${loggedUsername}/friends`}>
                        Znajomi
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout} >
                        Wyloguj
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Przyciski do logowania i rejestracji */}
                <button className="btn btn-outline-light mx-2" onClick={() => setIsLoginModalVisable(true)}>
                  Zaloguj
                </button>
                <button className="btn btn-outline-light mx-2" onClick={() => setIsRegisterModalVisable(true)}>
                  Zarejestruj
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal show={isLoginModalVisable} onClose={() => setIsLoginModalVisable(false)} onLoginSuccess={handleLoginSuccess} />
      <RegistrationModal show={isRegisterModalVisable} onClose={() => setIsRegisterModalVisable(false)} />
    </>
  );
};

export default NavBar;

// return (
//     <div className="w-60 text-center d-flex justify-content-center align-items-center" 
//     style={{ minHeight: "80px", minWidth:"70%", backgroundColor: "#02022c" }}>
//     </div>
// );