const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  toppings: [{
    type: String
  }],
  category: {
    type: String,
    enum: ['Classic', 'Specialty', 'Vegetarian', 'Meat Lovers'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pizza', PizzaSchema);
