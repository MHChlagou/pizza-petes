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
    const initializeOrder = async () => {
      try {
        // Fetch pizzas first
        const response = await axios.get('http://localhost:5000/api/pizzas');
        setPizzas(response.data);
        
        // Handle favorite or surprise order if present
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
        } else if (response.data.length > 0) {
          // Only set default pizza if no favorite/surprise order
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

    initializeOrder();
  }, [location.state]);

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
    <div className="pizza-builder" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <h2 style={{ 
        color: '#d63031', 
        marginBottom: '40px', 
        textAlign: 'center', 
        fontSize: '2em',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        CRAFT YOUR PERFECT PIZZA
      </h2>
      
      <div style={{
        display: 'grid',
        gap: '30px',
        padding: '30px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '40px'
      }}>
        <div className="form-group" style={{ marginBottom: '0' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            color: '#2d3436',
            fontSize: '1.1em',
            fontWeight: '500'
          }}>
            Select Your Pizza
          </label>
          <select 
            value={order.selectedPizza} 
            onChange={handlePizzaChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '1em',
              color: '#2d3436',
              backgroundColor: '#f8f9fa'
            }}
          >
            {pizzas.map(pizza => (
              <option key={pizza._id} value={pizza._id}>
                {pizza.name} - ${pizza.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px'
        }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#2d3436',
              fontSize: '1.1em',
              fontWeight: '500'
            }}>
              Delivery Method
            </label>
            <select 
              value={order.deliveryMethod} 
              onChange={handleDeliveryMethodChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#2d3436',
                backgroundColor: '#f8f9fa'
              }}
            >
              <option value="CarryOut">Carry Out</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#2d3436',
              fontSize: '1.1em',
              fontWeight: '500'
            }}>
              Payment Method
            </label>
            <select 
              value={order.paymentMethod} 
              onChange={handlePaymentMethodChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#2d3436',
                backgroundColor: '#f8f9fa'
              }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>
      </div>

      {order.deliveryMethod === 'Delivery' && (
        <div style={{
          padding: '30px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          marginBottom: '40px'
        }}>
          <h3 style={{
            color: '#2d3436',
            fontSize: '1.2em',
            fontWeight: '600',
            marginBottom: '25px'
          }}>
            Delivery Address
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={order.deliveryAddress.street}
                onChange={handleAddressChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1em',
                  color: '#2d3436',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px'
            }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={order.deliveryAddress.city}
                  onChange={handleAddressChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    color: '#2d3436',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={order.deliveryAddress.state}
                  onChange={handleAddressChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    color: '#2d3436',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={order.deliveryAddress.zipCode}
                  onChange={handleAddressChange}
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '1em',
                    color: '#2d3436',
                    backgroundColor: '#f8f9fa'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gap: '30px',
        padding: '30px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '40px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#2d3436',
              fontSize: '1.1em',
              fontWeight: '500'
            }}>
              Size
            </label>
            <select 
              value={order.size} 
              onChange={handleSizeChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#2d3436',
                backgroundColor: '#f8f9fa'
              }}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#2d3436',
              fontSize: '1.1em',
              fontWeight: '500'
            }}>
              Crust
            </label>
            <select 
              value={order.crust} 
              onChange={handleCrustChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#2d3436',
                backgroundColor: '#f8f9fa'
              }}
            >
              <option value="Thin Crust">Thin Crust</option>
              <option value="Thick Crust">Thick Crust</option>
              <option value="Stuffed Crust">Stuffed Crust (+$2.00)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              color: '#2d3436',
              fontSize: '1.1em',
              fontWeight: '500'
            }}>
              Quantity
            </label>
            <select 
              value={order.quantity} 
              onChange={handleQuantityChange}
              style={{
                width: '100%',
                padding: '12px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1em',
                color: '#2d3436',
                backgroundColor: '#f8f9fa'
              }}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '0' }}>
          <label style={{
            display: 'block',
            marginBottom: '15px',
            color: '#2d3436',
            fontSize: '1.1em',
            fontWeight: '500'
          }}>
            Extra Toppings (+$1.50 each)
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            padding: '25px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            {['Pepperoni', 'Mushrooms', 'Onions', 'Sausage', 'Bacon', 'Extra cheese', 'Green peppers', 'Black olives'].map((topping) => (
              <label 
                key={topping} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: order.extraToppings.includes(topping) ? '#fff' : 'transparent',
                  border: order.extraToppings.includes(topping) ? '1px solid #ddd' : '1px solid transparent',
                  width: '100%',
                  height: '45px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '20px'
                }}>
                  <input
                    type="checkbox"
                    checked={order.extraToppings.includes(topping)}
                    onChange={() => handleToppingToggle(topping)}
                    style={{ 
                      margin: 0,
                      width: '16px',
                      height: '16px'
                    }}
                  />
                </div>
                <span style={{ 
                  color: '#2d3436',
                  fontSize: '1em',
                  fontWeight: order.extraToppings.includes(topping) ? '500' : '400'
                }}>
                  {topping}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="order-summary">
        <h3 style={{ color: '#d63031', marginBottom: '25px', textAlign: 'center', fontSize: '1.5em' }}>
          ORDER SUMMARY
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '25px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {/* Pizza Details Section */}
          <div style={{ 
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ color: '#2d3436', marginBottom: '15px', fontSize: '1.2em' }}>Pizza Details</h4>
            {selectedPizza && (
              <div style={{ display: 'grid', gap: '10px' }}>
                <p style={{ fontSize: '1.1em', color: '#2d3436' }}>
                  <strong style={{ color: '#d63031' }}>Pizza:</strong> {selectedPizza.name}
                </p>
                <p style={{ color: '#636e72', fontSize: '0.95em' }}>
                  <strong style={{ color: '#2d3436' }}>Description:</strong> {selectedPizza.description}
                </p>
              </div>
            )}
          </div>

          {/* Order Details Section */}
          <div style={{ 
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <h4 style={{ color: '#2d3436', marginBottom: '15px', fontSize: '1.2em' }}>Order Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <p><strong style={{ color: '#d63031' }}>Size:</strong> {order.size}</p>
              <p><strong style={{ color: '#d63031' }}>Crust:</strong> {order.crust}</p>
              <p><strong style={{ color: '#d63031' }}>Quantity:</strong> {order.quantity}</p>
              <p><strong style={{ color: '#d63031' }}>Delivery:</strong> {order.deliveryMethod}</p>
              <p><strong style={{ color: '#d63031' }}>Payment:</strong> {order.paymentMethod}</p>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p><strong style={{ color: '#d63031' }}>Extra Toppings:</strong></p>
              <p style={{ color: '#636e72', fontSize: '0.95em' }}>
                {order.extraToppings.join(', ') || 'None'}
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{ 
            padding: '20px',
            background: '#d63031',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '1.1em', marginBottom: '5px' }}>Price per Pizza</p>
              <h4 style={{ fontSize: '1.8em', margin: '0' }}>${order.price.toFixed(2)}</h4>
            </div>
            <div style={{ 
              marginTop: '15px', 
              paddingTop: '15px', 
              borderTop: '1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{ fontSize: '1.2em', marginBottom: '5px' }}>Total Amount</p>
              <h4 style={{ fontSize: '2em', margin: '0' }}>${(order.price * order.quantity).toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '40px',
        paddingTop: '30px',
        borderTop: '1px solid #eee'
      }}>
        <button 
          onClick={handleStartOver} 
          className="btn"
          style={{
            padding: '12px 30px',
            fontSize: '1.1em',
            fontWeight: '500',
            backgroundColor: '#f8f9fa',
            color: '#2d3436',
            border: '1px solid #ddd',
            transition: 'all 0.2s ease'
          }}
        >
          START OVER
        </button>
        <button 
          onClick={handlePurchase} 
          className="btn btn-primary"
          style={{
            padding: '12px 40px',
            fontSize: '1.1em',
            fontWeight: '500',
            minWidth: '180px',
            transition: 'all 0.2s ease'
          }}
        >
          {user ? 'PLACE ORDER' : 'LOGIN TO ORDER'}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
