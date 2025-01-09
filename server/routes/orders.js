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
    // Get user with populated favoriteOrder
    const user = await req.user.populate('favoriteOrder');
    
    // Get all orders
    const orders = await Order.find({ user: req.user._id })
      .populate('items.pizza')
      .sort({ createdAt: -1 });

    // Mark favorite order
    const ordersWithFavorite = orders.map(order => ({
      ...order.toObject(),
      isFavorite: user.favoriteOrder?._id.toString() === order._id.toString()
    }));

    res.json(ordersWithFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/favorite
// @desc    Set an order as favorite
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

    // Check if this order is already favorite
    const isCurrentlyFavorite = req.user.favoriteOrder?.toString() === order._id.toString();
    
    // Toggle favorite status
    req.user.favoriteOrder = isCurrentlyFavorite ? null : order._id;
    await req.user.save();

    // Get all orders with updated favorite status
    const orders = await Order.find({ user: req.user._id })
      .populate('items.pizza')
      .sort({ createdAt: -1 });

    // Mark favorite order in response
    const ordersWithFavorite = orders.map(o => ({
      ...o.toObject(),
      isFavorite: req.user.favoriteOrder?.toString() === o._id.toString()
    }));

    res.json(ordersWithFavorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/favorite
// @desc    Get user's favorite order
// @access  Private
router.get('/favorite', protect, async (req, res) => {
  try {
    const user = await req.user.populate('favoriteOrder');
    if (!user.favoriteOrder) {
      return res.json(null);
    }
    
    const favoriteOrder = await Order.findById(user.favoriteOrder).populate('items.pizza');
    res.json(favoriteOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders/reorder-favorite
// @desc    Place a new order based on favorite order
// @access  Private
router.post('/reorder-favorite', protect, async (req, res) => {
  try {
    const user = await req.user.populate('favoriteOrder');
    if (!user.favoriteOrder) {
      return res.status(404).json({ message: 'No favorite order found' });
    }

    const favoriteOrder = await Order.findById(user.favoriteOrder).populate('items.pizza');
    
    // Create new order data from favorite
    const orderData = {
      items: favoriteOrder.items.map(item => ({
        pizza: item.pizza._id,
        size: item.size,
        crust: item.crust,
        extraToppings: item.extraToppings,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      })),
      deliveryMethod: favoriteOrder.deliveryMethod,
      paymentMethod: favoriteOrder.paymentMethod,
      deliveryAddress: favoriteOrder.deliveryAddress,
      total: favoriteOrder.total,
      user: req.user._id
    };

    const newOrder = await Order.create(orderData);
    const populatedOrder = await Order.findById(newOrder._id).populate('items.pizza');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
