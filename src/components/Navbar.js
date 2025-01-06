import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // In a real app, this would be managed by a cart context
  const orderCount = 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img 
          src="/images/logo/pizza-logo.png" 
          alt="Pizza Pete's" 
          style={{ height: '40px', marginRight: '10px' }}
        />
        PIZZA PETE'S
      </Link>
      <div className="navbar-links">
        <Link to="/">HOME</Link>
        <Link to="/order">
          ORDER {orderCount > 0 && <span className="order-count">({orderCount})</span>}
        </Link>
        <Link to="/account">ACCOUNT</Link>
        <button onClick={handleLogout} className="nav-link">LOGOUT</button>
      </div>
    </nav>
  );
};

export default Navbar;
