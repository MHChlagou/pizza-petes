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

  const toggleFavorite = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/favorite`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, isFavorite: !order.isFavorite }
          : order
      ));
    } catch (err) {
      setError('Failed to update favorite status');
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
      <div className="account-info">
        <h2>Account Information</h2>
        {error && <div className="error-message">{error}</div>}
        {updateSuccess && (
          <div className="success-message">Profile updated successfully!</div>
        )}
        
        <form onSubmit={handleUpdate}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                {cities[formData.state]?.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>

      <div className="past-orders">
        <h2>Order History</h2>
        {orders.length === 0 ? (
          <p>No orders yet. Start ordering your favorite pizzas!</p>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <span className="order-date">{formatDate(order.createdAt)}</span>
                <span className="order-status">{order.status}</span>
              </div>
              
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item-details">
                    <p><strong>{item.pizza?.name || 'Pizza'}</strong></p>
                    <p>Size: {item.size}</p>
                    <p>Crust: {item.crust}</p>
                    {item.extraToppings?.length > 0 && (
                      <p>Extra Toppings: {item.extraToppings.join(', ')}</p>
                    )}
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price?.toFixed(2)}</p>
                    <p>Subtotal: ${item.subtotal?.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-details">
                  <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  {order.deliveryAddress && (
                    <div className="delivery-address">
                      <p><strong>Delivery Address:</strong></p>
                      <p>{order.deliveryAddress.street}</p>
                      <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                      {order.deliveryAddress.zipCode && <p>ZIP: {order.deliveryAddress.zipCode}</p>}
                    </div>
                  )}
                </div>
                <div className="order-total">
                  <strong>Total: ${order.total?.toFixed(2)}</strong>
                </div>
                <div className="order-actions">
                  <label className="favorite-checkbox">
                    <input
                      type="checkbox"
                      checked={order.isFavorite}
                      onChange={() => toggleFavorite(order._id)}
                    />
                    Favorite
                  </label>
                  {order.status === 'Pending' && (
                    <span className="order-status-pending">Processing</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Account;
