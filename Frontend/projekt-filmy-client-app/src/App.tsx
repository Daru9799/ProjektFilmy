import React from 'react';
import './styles/App.css';
import NavBar from './components/Navbar_componets/NavBar';
import { Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <div className="Container">
      <NavBar />
      <div className="App">
        <Outlet />
      </div>
      <div className="Footer">
        <p className="text-white fw-light">Copyright © WebFilm 2025;</p>
      </div>
    </div>
  );
}

export default App;
