import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { states } from '../data/states';
import { cities } from '../data/cities';
import axios from 'axios';

const Account = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: 'TUN',
    zipCode: ''
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || 'TUN',
        zipCode: user.zipCode || ''
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load order history');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setUpdateSuccess(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/auth/update',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUpdateSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const [favoriteLoading, setFavoriteLoading] = useState(null);

  const toggleFavorite = async (orderId) => {
    try {
      setFavoriteLoading(orderId);
      const currentOrder = orders.find(o => o._id === orderId);
      const isSetting = !currentOrder.isFavorite;

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/favorite`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update orders with the response that includes correct favorite status
      setOrders(response.data);

      // Show appropriate success message
      const isFavorite = response.data.find(o => o._id === orderId)?.isFavorite;
      setUpdateSuccess(true);
      setError('');
      const message = isFavorite ? 
        'Order set as favorite! You can quickly reorder it from the home page.' :
        'Favorite order removed.';
      setUpdateSuccess(message);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update favorite order');
    } finally {
      setFavoriteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="account-page">
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '35px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: '#d63031', 
          marginBottom: '35px', 
          textAlign: 'center', 
          fontSize: '2em',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          Account Information
        </h2>
        
        {error && (
          <div style={{
            padding: '12px 20px',
            background: '#ffe3e3',
            color: '#d63031',
            borderRadius: '8px',
            marginBottom: '25px',
            fontSize: '1.1em'
          }}>
            {error}
          </div>
        )}
        
        {updateSuccess && (
          <div style={{
            padding: '12px 20px',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '8px',
            marginBottom: '25px',
            fontSize: '1.1em'
          }}>
            Profile updated successfully!
          </div>
        )}
        
        <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '25px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label 
                htmlFor="firstName"
                style={{
                  color: '#2d3436',
                  fontSize: '1.1em',
                  fontWeight: '500'
                }}
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
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
            <div style={{ display: 'grid', gap: '10px' }}>
              <label 
                htmlFor="lastName"
                style={{
                  color: '#2d3436',
                  fontSize: '1.1em',
                  fontWeight: '500'
                }}
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
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
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <label 
              htmlFor="email"
              style={{
                color: '#2d3436',
                fontSize: '1.1em',
                fontWeight: '500'
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          <div style={{ display: 'grid', gap: '10px' }}>
            <label 
              htmlFor="address"
              style={{
                color: '#2d3436',
                fontSize: '1.1em',
                fontWeight: '500'
              }}
            >
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label 
                htmlFor="state"
                style={{
                  color: '#2d3436',
                  fontSize: '1.1em',
                  fontWeight: '500'
                }}
              >
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
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
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label 
                htmlFor="city"
                style={{
                  color: '#2d3436',
                  fontSize: '1.1em',
                  fontWeight: '500'
                }}
              >
                City
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
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
              >
                <option value="">Select City</option>
                {cities[formData.state]?.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label 
                htmlFor="zipCode"
                style={{
                  color: '#2d3436',
                  fontSize: '1.1em',
                  fontWeight: '500'
                }}
              >
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
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

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '15px'
          }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                padding: '12px 40px',
                fontSize: '1.1em',
                fontWeight: '500',
                minWidth: '200px',
                transition: 'all 0.2s ease'
              }}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      <div className="past-orders" style={{ marginTop: '50px' }}>
        <h2 style={{ 
          color: '#d63031', 
          marginBottom: '30px', 
          textAlign: 'center', 
          fontSize: '1.8em',
          fontWeight: '600'
        }}>
          Order History
        </h2>
        {orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '1.1em', color: '#636e72' }}>
              No orders yet. Start ordering your favorite pizzas!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '30px' }}>
            {orders.map(order => (
              <div key={order._id} style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                border: '1px solid #eee'
              }}>
                {/* Order Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{
                      fontSize: '1.1em',
                      color: '#2d3436',
                      fontWeight: '500'
                    }}>
                      {formatDate(order.createdAt)}
                    </span>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9em',
                      fontWeight: '500',
                      background: order.status === 'Pending' ? '#fdcb6e' : '#d63031',
                      color: order.status === 'Pending' ? '#2d3436' : 'white'
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleFavorite(order._id)}
                    disabled={favoriteLoading === order._id}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '2px solid #d63031',
                      background: order.isFavorite ? '#d63031' : 'transparent',
                      color: order.isFavorite ? 'white' : '#d63031',
                      cursor: favoriteLoading === order._id ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.9em',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      opacity: favoriteLoading === order._id ? 0.7 : 1
                    }}
                    title={order.isFavorite ? 'Remove as favorite' : 'Set as favorite order for quick reordering'}
                  >
                    {favoriteLoading === order._id ? (
                      'Updating...'
                    ) : order.isFavorite ? (
                      <>★ Current Favorite Order</>
                    ) : (
                      <>☆ Set as Quick Reorder</>
                    )}
                  </button>
                </div>

                {/* Order Items */}
                <div style={{ padding: '20px' }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      padding: '15px',
                      background: '#f8f9fa',
                      borderRadius: '8px',
                      marginBottom: '15px',
                      border: '1px solid #eee'
                    }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                      }}>
                        <div>
                          <h4 style={{ 
                            color: '#d63031', 
                            marginBottom: '10px',
                            fontSize: '1.2em'
                          }}>
                            {item.pizza?.name || 'Pizza'}
                          </h4>
                          <p style={{ color: '#636e72', marginBottom: '5px' }}>
                            <strong style={{ color: '#2d3436' }}>Size:</strong> {item.size}
                          </p>
                          <p style={{ color: '#636e72', marginBottom: '5px' }}>
                            <strong style={{ color: '#2d3436' }}>Crust:</strong> {item.crust}
                          </p>
                          {item.extraToppings?.length > 0 && (
                            <p style={{ color: '#636e72', marginBottom: '5px' }}>
                              <strong style={{ color: '#2d3436' }}>Extra Toppings:</strong> {item.extraToppings.join(', ')}
                            </p>
                          )}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'center',
                          gap: '5px'
                        }}>
                          <p style={{ color: '#636e72' }}>
                            <strong style={{ color: '#2d3436' }}>Quantity:</strong> {item.quantity}
                          </p>
                          <p style={{ color: '#636e72' }}>
                            <strong style={{ color: '#2d3436' }}>Price:</strong> ${item.price?.toFixed(2)}
                          </p>
                          <p style={{ color: '#2d3436', fontWeight: '500' }}>
                            Subtotal: ${item.subtotal?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div style={{
                  padding: '20px',
                  background: '#f8f9fa',
                  borderTop: '1px solid #eee',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '20px'
                }}>
                  <div>
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ color: '#636e72', marginBottom: '5px' }}>
                        <strong style={{ color: '#2d3436' }}>Delivery Method:</strong> {order.deliveryMethod}
                      </p>
                      <p style={{ color: '#636e72' }}>
                        <strong style={{ color: '#2d3436' }}>Payment Method:</strong> {order.paymentMethod}
                      </p>
                    </div>
                    {order.deliveryAddress && (
                      <div style={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #eee'
                      }}>
                        <p style={{ color: '#2d3436', fontWeight: '500', marginBottom: '10px' }}>
                          Delivery Address:
                        </p>
                        <p style={{ color: '#636e72', marginBottom: '5px' }}>{order.deliveryAddress.street}</p>
                        <p style={{ color: '#636e72', marginBottom: '5px' }}>
                          {order.deliveryAddress.city}, {order.deliveryAddress.state}
                        </p>
                        {order.deliveryAddress.zipCode && (
                          <p style={{ color: '#636e72' }}>ZIP: {order.deliveryAddress.zipCode}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                  }}>
                    <div style={{
                      padding: '15px 25px',
                      background: '#d63031',
                      color: 'white',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '0.9em', marginBottom: '5px' }}>Total Amount</p>
                      <p style={{ fontSize: '1.4em', fontWeight: '600' }}>
                        ${order.total?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
