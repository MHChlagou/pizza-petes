import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [order, setOrder] = useState({
    selectedPizza: '',
    deliveryMethod: 'CarryOut',
    paymentMethod: 'Cash',
    size: 'Large',
    crust: 'Thin Crust',
    quantity: 1,
    extraToppings: [],
    price: 0,
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const location = useLocation();
  
  useEffect(() => {
    fetchPizzas();
  }, []);

  useEffect(() => {
    // Handle favorite order or surprise order if passed through navigation
    if (location.state?.favoriteOrder) {
      setOrder(prev => ({
        ...prev,
        ...location.state.favoriteOrder
      }));
    } else if (location.state?.surpriseOrder) {
      setOrder(prev => ({
        ...prev,
        ...location.state.surpriseOrder
      }));
    }
  }, [location.state]);

  const fetchPizzas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pizzas');
      setPizzas(response.data);
      if (response.data.length > 0) {
        setOrder(prev => ({
          ...prev,
          selectedPizza: response.data[0]._id,
          price: response.data[0].price
        }));
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load pizzas. Please try again later.');
      setLoading(false);
    }
  };

  const handlePizzaChange = (e) => {
    const selectedPizza = pizzas.find(p => p._id === e.target.value);
    setOrder({
      ...order,
      selectedPizza: e.target.value,
      price: selectedPizza.price,
      extraToppings: []
    });
  };

  const handleDeliveryMethodChange = (e) => {
    setOrder({ ...order, deliveryMethod: e.target.value });
  };

  const handlePaymentMethodChange = (e) => {
    setOrder({ ...order, paymentMethod: e.target.value });
  };

  const handleSizeChange = (e) => {
    const size = e.target.value;
    let priceMultiplier = 1;
    switch (size) {
      case 'Small':
        priceMultiplier = 0.8;
        break;
      case 'Medium':
        priceMultiplier = 0.9;
        break;
      case 'Large':
        priceMultiplier = 1;
        break;
      default:
        priceMultiplier = 1;
    }
    
    const selectedPizza = pizzas.find(p => p._id === order.selectedPizza);
    const newPrice = selectedPizza.price * priceMultiplier;
    
    setOrder({ ...order, size, price: newPrice });
  };

  const handleCrustChange = (e) => {
    const crust = e.target.value;
    let extraCharge = 0;
    if (crust === 'Stuffed Crust') {
      extraCharge = 2;
    }
    setOrder({ ...order, crust, price: order.price + extraCharge });
  };

  const handleQuantityChange = (e) => {
    setOrder({ ...order, quantity: parseInt(e.target.value) });
  };

  const handleToppingToggle = (topping) => {
    const newToppings = order.extraToppings.includes(topping)
      ? order.extraToppings.filter(t => t !== topping)
      : [...order.extraToppings, topping];
    
    // Each extra topping costs $1.50
    const selectedPizza = pizzas.find(p => p._id === order.selectedPizza);
    const basePrice = selectedPizza.price;
    const toppingsPrice = newToppings.length * 1.50;
    
    setOrder({
      ...order,
      extraToppings: newToppings,
      price: basePrice + toppingsPrice
    });
  };

  const handleAddressChange = (e) => {
    setOrder({
      ...order,
      deliveryAddress: {
        ...order.deliveryAddress,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleStartOver = () => {
    const selectedPizza = pizzas.find(p => p._id === order.selectedPizza);
    setOrder({
      selectedPizza: order.selectedPizza,
      deliveryMethod: 'CarryOut',
      paymentMethod: 'Cash',
      size: 'Large',
      crust: 'Thin Crust',
      quantity: 1,
      extraToppings: [],
      price: selectedPizza ? selectedPizza.price : 0,
      deliveryAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    });
  };

  const handlePurchase = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      const orderData = {
        items: [{
          pizza: order.selectedPizza,
          size: order.size,
          crust: order.crust,
          extraToppings: order.extraToppings,
          quantity: order.quantity,
          price: order.price,
          subtotal: order.price * order.quantity
        }],
        deliveryMethod: order.deliveryMethod,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryMethod === 'Delivery' ? order.deliveryAddress : null,
        total: order.price * order.quantity
      };

      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (pizzas.length === 0) return <div>No pizzas available</div>;

  const selectedPizza = pizzas.find(p => p._id === order.selectedPizza);

  return (
    <div className="pizza-builder">
      <h2>CRAFT YOUR PERFECT PIZZA</h2>
      
      <div className="form-group">
        <label>SELECT PIZZA:</label>
        <select value={order.selectedPizza} onChange={handlePizzaChange}>
          {pizzas.map(pizza => (
            <option key={pizza._id} value={pizza._id}>
              {pizza.name} - ${pizza.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>DELIVERY METHOD:</label>
        <select value={order.deliveryMethod} onChange={handleDeliveryMethodChange}>
          <option value="CarryOut">Carry Out</option>
          <option value="Delivery">Delivery</option>
        </select>
      </div>

      <div className="form-group">
        <label>PAYMENT METHOD:</label>
        <select value={order.paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
      </div>

      {order.deliveryMethod === 'Delivery' && (
        <div className="delivery-address">
          <h3>Delivery Address</h3>
          <div className="form-group">
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={order.deliveryAddress.street}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={order.deliveryAddress.city}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="state"
                placeholder="State"
                value={order.deliveryAddress.state}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={order.deliveryAddress.zipCode}
                onChange={handleAddressChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>SIZE:</label>
        <select value={order.size} onChange={handleSizeChange}>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <div className="form-group">
        <label>CRUST:</label>
        <select value={order.crust} onChange={handleCrustChange}>
          <option value="Thin Crust">Thin Crust</option>
          <option value="Thick Crust">Thick Crust</option>
          <option value="Stuffed Crust">Stuffed Crust (+$2.00)</option>
        </select>
      </div>

      <div className="form-group">
        <label>QUANTITY:</label>
        <select value={order.quantity} onChange={handleQuantityChange}>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>EXTRA TOPPINGS (+$1.50 each):</label>
        <div className="toppings-grid">
          {['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Extra cheese', 'Green peppers', 'Black olives'].map((topping) => (
            <label key={topping} className="topping-option">
              <input
                type="checkbox"
                checked={order.extraToppings.includes(topping)}
                onChange={() => handleToppingToggle(topping)}
              />
              {topping}
            </label>
          ))}
        </div>
      </div>

      <div className="order-summary">
        <h3>ORDER SUMMARY</h3>
        {selectedPizza && (
          <>
            <p><strong>Pizza:</strong> {selectedPizza.name}</p>
            <p><strong>Description:</strong> {selectedPizza.description}</p>
          </>
        )}
        <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Size:</strong> {order.size}</p>
        <p><strong>Crust:</strong> {order.crust}</p>
        <p><strong>Quantity:</strong> {order.quantity}</p>
        <p><strong>Extra Toppings:</strong> {order.extraToppings.join(', ') || 'None'}</p>
        <h4>PRICE PER PIZZA: ${order.price.toFixed(2)}</h4>
        <h4>TOTAL: ${(order.price * order.quantity).toFixed(2)}</h4>
      </div>

      <div className="button-group">
        <button onClick={handleStartOver} className="btn">START OVER</button>
        <button onClick={handlePurchase} className="btn btn-primary">
          {user ? 'PLACE ORDER' : 'LOGIN TO ORDER'}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
