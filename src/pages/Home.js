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

  // Load favorite order if user is authenticated
  useEffect(() => {
    const loadFavorite = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/api/orders/favorite', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          setFavorites(response.data ? [response.data] : []);
        } catch (err) {
          console.error('Failed to fetch favorite order:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadFavorite();
  }, [user]);

  const handleNewOrder = () => {
    navigate('/order');
  };

  const handleReorderFave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      // Get the favorite order details
      const response = await axios.get('http://localhost:5000/api/orders/favorite', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.data) {
        navigate('/order');
        return;
      }

      const favoriteOrder = response.data;
      
      // Navigate to order page with favorite order details
      navigate('/order', { 
        state: { 
          favoriteOrder: {
            selectedPizza: favoriteOrder.items[0].pizza._id,
            size: favoriteOrder.items[0].size,
            crust: favoriteOrder.items[0].crust,
            quantity: favoriteOrder.items[0].quantity,
            extraToppings: favoriteOrder.items[0].extraToppings,
            deliveryMethod: favoriteOrder.deliveryMethod,
            paymentMethod: favoriteOrder.paymentMethod,
            deliveryAddress: favoriteOrder.deliveryAddress,
            price: favoriteOrder.items[0].price
          }
        }
      });
    } catch (err) {
      console.error('Failed to get favorite order:', err);
      navigate('/order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = () => {
    if (!pizzas) {
      navigate('/order');
      return;
    }

    // Random selections
    const randomPizza = pizzas[Math.floor(Math.random() * pizzas.length)];
    const sizes = ['Small', 'Medium', 'Large'];
    const crusts = ['Thin Crust', 'Thick Crust', 'Stuffed Crust'];
    const deliveryMethods = ['CarryOut', 'Delivery'];
    const paymentMethods = ['Cash', 'Card'];
    const quantities = [1, 2, 3];
    const allToppings = [
      'Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 
      'Bacon', 'Extra cheese', 'Green peppers', 'Black olives'
    ];
    
    // Randomly select 0-4 toppings
    const numToppings = Math.floor(Math.random() * 5);
    const shuffledToppings = [...allToppings].sort(() => 0.5 - Math.random());
    const selectedToppings = shuffledToppings.slice(0, numToppings);

    // Calculate base price based on size
    const selectedSize = sizes[Math.floor(Math.random() * sizes.length)];
    let priceMultiplier = 1;
    switch (selectedSize) {
      case 'Small': priceMultiplier = 0.8; break;
      case 'Medium': priceMultiplier = 0.9; break;
      case 'Large': priceMultiplier = 1; break;
    }

    // Calculate price with toppings and crust
    const selectedCrust = crusts[Math.floor(Math.random() * crusts.length)];
    const basePrice = randomPizza.price * priceMultiplier;
    const toppingsPrice = selectedToppings.length * 1.50;
    const crustPrice = selectedCrust === 'Stuffed Crust' ? 2 : 0;
    const totalPrice = basePrice + toppingsPrice + crustPrice;
    
    navigate('/order', {
      state: {
        surpriseOrder: {
          selectedPizza: randomPizza._id,
          size: selectedSize,
          crust: selectedCrust,
          quantity: quantities[Math.floor(Math.random() * quantities.length)],
          extraToppings: selectedToppings,
          deliveryMethod: deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)],
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          price: totalPrice
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
