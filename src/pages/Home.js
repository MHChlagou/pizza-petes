import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalImages = 3; // logo + 2 pizza images

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
    setLoading(false);
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavorites(response.data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const handleNewOrder = () => {
    navigate('/order');
  };

  const handleReorderFave = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (favorites.length === 0) {
      navigate('/order');
      return;
    }

    // Get the most recent favorite order
    const lastFavorite = favorites[0];
    
    // Pre-fill the order form with the favorite order details
    navigate('/order', { 
      state: { 
        favoriteOrder: {
          selectedPizza: lastFavorite.items[0].pizza._id,
          size: lastFavorite.items[0].size,
          crust: lastFavorite.items[0].crust,
          quantity: lastFavorite.items[0].quantity,
          extraToppings: lastFavorite.items[0].extraToppings,
          deliveryMethod: lastFavorite.deliveryMethod,
          paymentMethod: lastFavorite.paymentMethod,
          deliveryAddress: lastFavorite.deliveryAddress
        }
      }
    });
  };

  const handleSurpriseMe = async () => {
    try {
      // Get all available pizzas
      const response = await axios.get('http://localhost:5000/api/pizzas');
      const pizzas = response.data;
      
      // Select random options
      const randomPizza = pizzas[Math.floor(Math.random() * pizzas.length)];
      const sizes = ['Small', 'Medium', 'Large'];
      const crusts = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
      
      navigate('/order', {
        state: {
          surpriseOrder: {
            selectedPizza: randomPizza._id,
            size: sizes[Math.floor(Math.random() * sizes.length)],
            crust: crusts[Math.floor(Math.random() * crusts.length)],
            quantity: 1,
            extraToppings: [],
            deliveryMethod: 'CarryOut',
            paymentMethod: 'Cash'
          }
        }
      });
    } catch (err) {
      console.error('Failed to get pizzas:', err);
      navigate('/order');
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        {imagesLoaded < totalImages && <div className="loading-spinner">Loading...</div>}
        <img 
          src="/images/logo/pizza-logo.png" 
          alt="Pizza Pete's Logo" 
          className="hero-logo" 
          onLoad={handleImageLoad}
          style={{ display: imagesLoaded === totalImages ? 'block' : 'none' }}
        />
        <h1>Welcome to Pizza Pete's</h1>
        <p>Crafting the Perfect Slice Since 2024</p>
        <button className="btn btn-primary hero-button" onClick={handleNewOrder}>
          Order Now
        </button>
      </div>

      <div className="featured-section">
        <h2>Our Signature Pizzas</h2>
        <div className="featured-pizzas">
          <div className="featured-pizza">
            <img 
              src="/images/pizza-img.png" 
              alt="Delicious Pizza" 
              onLoad={handleImageLoad}
              style={{ display: imagesLoaded === totalImages ? 'block' : 'none' }}
            />
            <h3>Classic Pepperoni</h3>
            <p>Our most popular pizza loaded with premium pepperoni</p>
          </div>
          <div className="featured-pizza">
            <img 
              src="/images/pizza-img-2.png" 
              alt="Special Pizza" 
              onLoad={handleImageLoad}
              style={{ display: imagesLoaded === totalImages ? 'block' : 'none' }}
            />
            <h3>Supreme Special</h3>
            <p>Loaded with fresh vegetables and premium toppings</p>
          </div>
        </div>
      </div>

      <div className="ordering-section">
        <h2>Quick Order Options</h2>
        <div className="quick-options">
          <div className="option-card" onClick={handleNewOrder}>
            <h3>NEW ORDER</h3>
            <p>Create your perfect pizza from scratch</p>
            <button className="btn btn-primary">START FRESH</button>
          </div>

          <div className="option-card" onClick={handleReorderFave}>
            <h3>RE-ORDER FAVORITE</h3>
            <p>{user ? (favorites.length > 0 ? 'Quick order from your saved favorites' : 'No favorites yet - create some!') : 'Login to access your favorites'}</p>
            <button className="btn btn-primary">ORDER AGAIN</button>
          </div>

          <div className="option-card" onClick={handleSurpriseMe}>
            <h3>SURPRISE ME</h3>
            <p>Try our chef's special creation</p>
            <button className="btn btn-primary">SURPRISE ME</button>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Why Choose Pizza Pete's?</h2>
        <div className="features">
          <div className="feature">
            <h3>Fresh Ingredients</h3>
            <p>We use only the freshest ingredients in our pizzas</p>
          </div>
          <div className="feature">
            <h3>Quick Delivery</h3>
            <p>Hot and fresh pizza delivered to your doorstep</p>
          </div>
          <div className="feature">
            <h3>Custom Orders</h3>
            <p>Create your perfect pizza with our wide range of toppings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
