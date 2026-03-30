import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/vehicle.css";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <nav className="simple-navbar">
      <Link to="/" style={{ fontWeight: 700, fontSize: 22, color: '#fff', textDecoration: 'none' }}>TicoAutos</Link>
      <ul>
        {isAuthenticated && <li><Link to="/my-inbox">Mi Inbox</Link></li>}
        {isAuthenticated && <li><Link to="/my-questions">My Questions</Link></li>}
        {isAuthenticated && <li><Link to="/my-vehicles">My Vehicles</Link></li>}
        {isAuthenticated && <li><Link to="/add-vehicle">Register Vehicle</Link></li>}
        {!isAuthenticated && <li><Link to="/auth">Login/Register</Link></li>}
        {isAuthenticated && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
