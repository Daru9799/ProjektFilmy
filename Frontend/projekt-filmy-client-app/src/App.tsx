import React from 'react';
import './styles/App.css';
import NavBar from './components/Navbar_componets/NavBar';
import { Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NotificationProvider } from "../src/components/Notifications_components/NotificationsContext";

function App() {
  return (
    <NotificationProvider>
      <div className="Container">
        <NavBar />
        <div className="App">
          <Outlet />
        </div>
        <div className="Footer">
          <p className="text-white fw-light">Copyright © WebFilm 2025;</p>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;
