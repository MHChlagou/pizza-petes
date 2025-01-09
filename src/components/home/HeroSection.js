import React from 'react';
import { ShoppingCart, Pizza } from 'lucide-react';

const HeroSection = ({ onOrderClick }) => (
  <div style={{
    position: 'relative',
    minHeight: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    background: `
      linear-gradient(
        rgba(255, 255, 255, 0.9),
        rgba(255, 255, 255, 0.9)
      ),
      url(${process.env.PUBLIC_URL + '/images/supreme.png'})
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    overflow: 'hidden'
  }}>
    {/* Decorative Elements */}
    <div style={{
      position: 'absolute',
      top: '10%',
      left: '5%',
      animation: 'float 6s ease-in-out infinite',
    }}>
      <Pizza size={60} style={{ color: '#d63031', opacity: 0.2 }} />
    </div>
    <div style={{
      position: 'absolute',
      bottom: '15%',
      right: '8%',
      animation: 'float 8s ease-in-out infinite',
      animationDelay: '1s'
    }}>
      <Pizza size={80} style={{ color: '#d63031', opacity: 0.2 }} />
    </div>

    <div style={{
      maxWidth: '800px',
      textAlign: 'center',
      animation: 'fadeIn 1s ease-out'
    }}>
      <img 
        src={process.env.PUBLIC_URL + '/images/logo/pizza-logo.png'} 
        alt="Pizza Pete's Logo" 
        style={{
          width: '180px',
          height: '180px',
          marginBottom: '30px',
          animation: 'bounce 2s ease infinite',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
        }}
        loading="eager"
        fetchPriority="high"
      />
      
      <h1 style={{
        fontSize: '3.5em',
        fontWeight: '800',
        color: '#2d3436',
        marginBottom: '20px',
        letterSpacing: '1px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}>
        Welcome to Pizza Pete's
      </h1>
      
      <p style={{
        fontSize: '1.4em',
        color: '#636e72',
        marginBottom: '40px',
        lineHeight: '1.6',
        maxWidth: '600px',
        margin: '0 auto 40px'
      }}>
        Crafting the Perfect Slice Since 2024
      </p>

      <button 
        onClick={onOrderClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#d63031',
          color: 'white',
          border: 'none',
          padding: '16px 40px',
          fontSize: '1.2em',
          fontWeight: '600',
          borderRadius: '30px',
          cursor: 'pointer',
          margin: '0 auto',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(214, 48, 49, 0.2)',
          transform: 'translateY(0)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(214, 48, 49, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(214, 48, 49, 0.2)';
        }}
      >
        <ShoppingCart size={24} />
        Order Now
      </button>
    </div>

    <style>
      {`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
    </style>
  </div>
);

export default React.memo(HeroSection);
