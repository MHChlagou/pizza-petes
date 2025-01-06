const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large'],
      required: true
    },
    crust: {
      type: String,
      enum: ['Thin Crust', 'Thick Crust', 'Stuffed Crust'],
      required: true
    },
    extraToppings: [{
      type: String
    }],
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card'],
    required: true
  },
  deliveryMethod: {
    type: String,
    enum: ['CarryOut', 'Delivery'],
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Completed'],
    default: 'Pending'
  },
  specialInstructions: {
    type: String
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate subtotal and total before saving
orderSchema.pre('save', function(next) {
  // Calculate subtotal for each item
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  
  // Calculate total order amount
  this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
