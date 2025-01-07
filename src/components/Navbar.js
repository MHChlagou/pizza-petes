import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home,
  ShoppingCart,
  User,
  LogOut
} from 'lucide-react';

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
        <Link to="/" className="nav-link">
          <Home size={18} />
          <span>HOME</span>
        </Link>
        <Link to="/order" className="nav-link">
          <ShoppingCart size={18} />
          <span>ORDER</span>
          {orderCount > 0 && <span className="order-count">({orderCount})</span>}
        </Link>
        <Link to="/account" className="nav-link">
          <User size={18} />
          <span>ACCOUNT</span>
        </Link>
        <button onClick={handleLogout} className="nav-link">
          <LogOut size={18} />
          <span>LOGOUT</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
