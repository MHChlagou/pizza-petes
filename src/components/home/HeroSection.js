import React from 'react';
import { ShoppingCart } from 'lucide-react';

const HeroSection = ({ onOrderClick }) => (
  <div className="hero-section">
    <img 
      src={process.env.PUBLIC_URL + '/images/logo/pizza-logo.png'} 
      alt="Pizza Pete's Logo" 
      className="hero-logo"
      width="150"
      height="150"
      loading="eager"
      fetchPriority="high"
    />
    <h1>Welcome to Pizza Pete's</h1>
    <p>Crafting the Perfect Slice Since 2024</p>
    <button className="btn btn-primary hero-button" onClick={onOrderClick}>
      <ShoppingCart className="btn-icon" size={20} />
      Order Now
    </button>
  </div>
);

export default React.memo(HeroSection);
