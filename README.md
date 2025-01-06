# Pizza Pete's Online Ordering System

A full-stack web application for ordering pizzas online, built with React and Node.js.

## Features

- User authentication (register, login, profile management)
- Interactive pizza ordering system
- Customizable pizza options (size, crust, toppings)
- Delivery and payment method selection
- Order history tracking
- Favorite orders system
- Surprise me feature for random pizza selection
- Tunisia-specific location selection

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- Context API for state management
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Project Structure

```
pizza-petes/
├── public/                 # Static files
│   ├── images/            # Image assets
│   └── index.html         # Main HTML file
├── server/                # Backend code
│   ├── config/           
│   │   └── db.js         # Database configuration
│   ├── middleware/
│   │   └── auth.js       # Authentication middleware
│   ├── models/           # Mongoose models
│   │   ├── Order.js      # Order schema
│   │   ├── Pizza.js      # Pizza schema
│   │   └── User.js       # User schema
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── orders.js     # Order management routes
│   │   └── pizzas.js     # Pizza management routes
│   └── server.js         # Main server file
└── src/                  # Frontend code
    ├── components/       # Reusable components
    │   ├── Navbar.js     # Navigation bar
    │   └── PrivateRoute.js # Protected route wrapper
    ├── context/
    │   └── AuthContext.js # Authentication context
    ├── data/            # Static data
    │   ├── cities.js    # Tunisia cities data
    │   └── states.js    # Tunisia governorates data
    ├── pages/           # Page components
    │   ├── Account.js   # User profile page
    │   ├── Home.js      # Landing page
    │   ├── Login.js     # Login page
    │   ├── OrderPage.js # Pizza ordering page
    │   └── Register.js  # Registration page
    ├── App.js           # Main React component
    └── index.js         # React entry point

```

## Key Files Description

### Backend

#### Models
- `Order.js`: Defines the order schema including pizza selections, delivery details, and payment method
- `Pizza.js`: Defines the pizza schema with name, description, price, and available options
- `User.js`: Defines user schema with authentication and profile information

#### Routes
- `auth.js`: Handles user registration, login, and profile updates
- `orders.js`: Manages order creation, retrieval, and favorite status
- `pizzas.js`: Handles pizza menu operations

#### Middleware
- `auth.js`: JWT authentication middleware for protected routes

### Frontend

#### Pages
- `Home.js`: Landing page with quick order options and featured pizzas
- `OrderPage.js`: Main ordering interface with pizza customization
- `Account.js`: User profile management and order history
- `Login.js` & `Register.js`: Authentication pages

#### Context
- `AuthContext.js`: Manages user authentication state across the application

#### Data
- `states.js`: List of Tunisia's governorates
- `cities.js`: Cities mapped to their respective governorates

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd pizza-petes
   npm install

   # Install frontend dependencies
   cd client
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   npm run server

   # Start frontend development server
   npm run client
   ```

5. Access the application at `http://localhost:3000`

## Features in Detail

### Pizza Ordering
- Select from menu of pre-defined pizzas
- Customize size (Small, Medium, Large)
- Choose crust type (Thin, Thick, Stuffed)
- Add extra toppings
- Select delivery method (Carry Out, Delivery)
- Choose payment method (Cash, Card)

### User Features
- Create and manage user profile
- View order history
- Mark orders as favorites
- Quick reorder from favorites
- Random pizza selection with "Surprise Me"

### Location Selection
- Tunisia-specific governorate selection
- Dynamic city selection based on chosen governorate
- Optional postal code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
