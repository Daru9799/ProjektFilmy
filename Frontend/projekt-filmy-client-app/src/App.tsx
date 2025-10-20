import './styles/App.css';
import NavBar from './components/Navbar_componets/NavBar';
import { Outlet } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NotificationProvider } from "../src/components/Notifications_components/NotificationsContext";
import QueryProvider from './providers/QueryProvider';
import { Bounce, ToastContainer } from 'react-toastify';

function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <ToastContainer position="bottom-right" transition={Bounce} autoClose={5000} style={{ zIndex: 9999 }} />
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
    </QueryProvider>
  );
}

export default App;
