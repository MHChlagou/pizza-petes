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
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 40px',
      background: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link 
        to="/" 
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: '#d63031',
          fontSize: '1.5em',
          fontWeight: '700',
          letterSpacing: '0.5px',
          transition: 'opacity 0.2s ease'
        }}
      >
        <img 
          src="/images/logo/pizza-logo.png" 
          alt="Pizza Pete's" 
          style={{ 
            height: '45px', 
            marginRight: '12px',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        PIZZA PETE'S
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '35px'
      }}>
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#2d3436',
            fontSize: '1.1em',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.color = '#d63031';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#2d3436';
          }}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link 
          to="/order" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#2d3436',
            fontSize: '1.1em',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.color = '#d63031';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#2d3436';
          }}
        >
          <ShoppingCart size={20} />
          <span>Order</span>
          {orderCount > 0 && (
            <span style={{
              background: '#d63031',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.85em',
              fontWeight: '600'
            }}>
              {orderCount}
            </span>
          )}
        </Link>

        <Link 
          to="/account" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#2d3436',
            fontSize: '1.1em',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.color = '#d63031';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#2d3436';
          }}
        >
          <User size={20} />
          <span>Account</span>
        </Link>

        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: '2px solid #d63031',
            color: '#d63031',
            fontSize: '1.1em',
            fontWeight: '500',
            padding: '8px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#d63031';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d63031';
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
