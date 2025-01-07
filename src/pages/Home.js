import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  PlusCircle, 
  Heart, 
  Sparkles, 
  Leaf, 
  Truck, 
  Pizza,
  ShoppingCart
} from 'lucide-react';

// Lazy loaded components
const HeroSection = lazy(() => import('../components/home/HeroSection'));
const FeaturedSection = lazy(() => import('../components/home/FeaturedSection'));
const OrderingSection = lazy(() => import('../components/home/OrderingSection'));
const AboutSection = lazy(() => import('../components/home/AboutSection'));

// Cache for pizzas data
let pizzasCache = null;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [pizzas, setPizzas] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load pizzas data on mount
  useEffect(() => {
    const loadPizzas = async () => {
      if (!pizzasCache) {
        try {
          const response = await axios.get('http://localhost:5000/api/pizzas');
          pizzasCache = response.data;
          setPizzas(pizzasCache);
        } catch (err) {
          console.error('Failed to fetch pizzas:', err);
        }
      } else {
        setPizzas(pizzasCache);
      }
    };
    loadPizzas();
  }, []);

  // Load favorites only if user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/api/orders/favorites', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          setFavorites(response.data);
        } catch (err) {
          console.error('Failed to fetch favorites:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadFavorites();
  }, [user]);

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

    const lastFavorite = favorites[0];
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

  const handleSurpriseMe = () => {
    if (!pizzas) {
      navigate('/order');
      return;
    }

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
  };

  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <div className="home-page">
        <HeroSection onOrderClick={handleNewOrder} />
        <FeaturedSection />
        <OrderingSection 
          user={user}
          favorites={favorites}
          isLoading={isLoading}
          onNewOrder={handleNewOrder}
          onReorderFave={handleReorderFave}
          onSurpriseMe={handleSurpriseMe}
        />
        <AboutSection />
      </div>
    </Suspense>
  );
};

export default Home;
