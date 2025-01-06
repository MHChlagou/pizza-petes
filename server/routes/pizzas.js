const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const { protect } = require('../middleware/auth');

// Get all pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true });
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pizza by ID
router.get('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes below
// Add new pizza (admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const pizza = new Pizza(req.body);
    const newPizza = await pizza.save();
    res.status(201).json(newPizza);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update pizza (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    res.json(pizza);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete pizza (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    res.json({ message: 'Pizza deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
