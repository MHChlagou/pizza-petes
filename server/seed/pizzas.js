const mongoose = require('mongoose');
const Pizza = require('../models/Pizza');
const connectDB = require('../config/db');
require('dotenv').config();

const pizzas = [
  {
    name: 'Margherita Classic',
    description: 'Fresh tomatoes, mozzarella, basil, and our signature tomato sauce',
    price: 12.99,
    image: '/images/pizza-img.png',
    toppings: ['Tomatoes', 'Mozzarella', 'Basil'],
    category: 'Classic'
  },
  {
    name: 'Pepperoni Supreme',
    description: 'Loaded with pepperoni, mozzarella, and our signature tomato sauce',
    price: 14.99,
    image: '/images/pizza-img-2.png',
    toppings: ['Pepperoni', 'Mozzarella'],
    category: 'Classic'
  },
  {
    name: 'Veggie Delight',
    description: 'Mushrooms, bell peppers, onions, olives, and tomatoes',
    price: 13.99,
    image: '/images/pizza-img.png',
    toppings: ['Mushrooms', 'Bell Peppers', 'Onions', 'Olives', 'Tomatoes'],
    category: 'Vegetarian'
  },
  {
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, bacon, ham, and ground beef',
    price: 16.99,
    image: '/images/pizza-img-2.png',
    toppings: ['Pepperoni', 'Sausage', 'Bacon', 'Ham', 'Ground Beef'],
    category: 'Meat Lovers'
  },
  {
    name: 'BBQ Chicken',
    description: 'Grilled chicken, red onions, BBQ sauce, and mozzarella',
    price: 15.99,
    image: '/images/pizza-img.png',
    toppings: ['Grilled Chicken', 'Red Onions', 'BBQ Sauce', 'Mozzarella'],
    category: 'Specialty'
  },
  {
    name: 'Hawaiian Paradise',
    description: 'Ham, pineapple, and extra mozzarella',
    price: 14.99,
    image: '/images/pizza-img-2.png',
    toppings: ['Ham', 'Pineapple', 'Extra Mozzarella'],
    category: 'Specialty'
  }
];

const seedPizzas = async () => {
  try {
    await connectDB();
    
    // Clear existing pizzas
    await Pizza.deleteMany({});
    
    // Insert new pizzas
    await Pizza.insertMany(pizzas);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedPizzas();
