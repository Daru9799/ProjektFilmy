import React, { useState } from "react";
import homeIcon from "../../imgs/home_icon.png";
import NavTile from "./NavTile";
import { Link } from "react-router-dom";
import LoginModal from "../SingIn_SignUp_componets/LoginModal";
import RegistrationModal from "../SingIn_SignUp_componets/RegistrationModal";
const NavBar = () => {

  const [isLoginModalVisable, setIsLoginModalVisable] = useState(false);
  const [isRegisterModalVisable, setIsRegisterModalVisable] = useState(false);

    return (
      <>
        <nav
          className="NavBar navbar-expand-lg text-white px-4 jersey-15-regular"
          style={{
            minHeight: "80px",
            minWidth: "70%",
            maxWidth: "70%",
          }}
        >
          <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Lewa część: Przyciski */}
            <div className="d-flex align-items-center ">
              {/*Guzik domku:*/}
              <button className="btn btn-light me-2">
                <Link to="">
                  <img
                    src={homeIcon}
                    alt=""
                    style={{ width: "20px", height: "20px" }}
                  />
                </Link>
              </button>
              <NavTile link="search-movies">Filmy</NavTile>
              <NavTile link="search-directors">Reżyserzy</NavTile>
              <NavTile link="search-actors">Aktorzy</NavTile>
              <NavTile link="/test">TEST BACKENDU</NavTile>
              <NavTile link="/user/user1">User1</NavTile>
              <NavTile link="/user/critic1">Critic1</NavTile>
            </div>

            {/* Prawa część: Logowanie/Rejestracja/Użytkownik */}
            <div className="d-flex align-items-center">
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

              {/* Informacje o użytkowniku - rozwijana lista*/}
              <div className="dropdown mx-2 d-none">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Użytkownik
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end hidden"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Profil
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Wyloguj
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
        <LoginModal
          show={isLoginModalVisable}
          onClose={() => setIsLoginModalVisable(false)}
        />
        <RegistrationModal
          show={isRegisterModalVisable}
          onClose={() => setIsRegisterModalVisable(false)}
        />
      </>
    );
    
};

export default NavBar;

// return (
//     <div className="w-60 text-center d-flex justify-content-center align-items-center" 
//     style={{ minHeight: "80px", minWidth:"70%", backgroundColor: "#02022c" }}>
//     </div>
// );