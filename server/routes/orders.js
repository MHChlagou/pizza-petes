const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      user: req.user._id
    };

    const order = await Order.create(orderData);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's order history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.pizza')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/favorite
// @desc    Toggle favorite status of an order
// @access  Private
router.put('/:id/favorite', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      user: req.user._id 
    }).populate('items.pizza');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isFavorite = !order.isFavorite;
    await order.save();

    // Return populated order
    const populatedOrder = await Order.findById(order._id).populate('items.pizza');
    res.json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/favorites
// @desc    Get user's favorite orders
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user._id,
      isFavorite: true 
    }).populate('items.pizza');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
