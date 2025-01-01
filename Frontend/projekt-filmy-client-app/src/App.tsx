import React from 'react';
import './styles/App.css';
import NavBar from './components/Navbar_componets/NavBar';

function App() {
  return (
    <div className="Container">
      <NavBar />
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
        </header>
      </div>
      <div className="Footer">
        <p className="text-white fw-light">Copyright © WebFilm 2025;</p>
      </div>
    </div>
  );
}

export default App;
