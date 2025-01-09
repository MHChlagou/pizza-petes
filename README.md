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
- React.js 18
- React Router v6 for navigation
- Axios for API requests
- Context API for state management
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
pizza-petes/
├── .env.development      # Development environment variables
├── .env.production      # Production environment variables
├── public/              # Static files
│   ├── images/          # Image assets
│   │   ├── pepperoni.png
│   │   ├── supreme.png
│   │   └── logo/
│   │       └── pizza-logo.png
│   ├── index.html       # Main HTML file
│   └── manifest.json    # Web app manifest
├── server/              # Backend code
│   ├── config/           
│   │   └── db.js       # Database configuration
│   ├── middleware/
│   │   └── auth.js     # Authentication middleware
│   ├── models/         # Mongoose models
│   │   ├── Order.js    # Order schema
│   │   ├── Pizza.js    # Pizza schema
│   │   └── User.js     # User schema
│   ├── routes/         # API routes
│   │   ├── auth.js     # Authentication routes
│   │   ├── orders.js   # Order management routes
│   │   └── pizzas.js   # Pizza management routes
│   ├── seed/
│   │   └── pizzas.js   # Initial pizza menu data
│   └── server.js       # Main server file
└── src/                # Frontend code
    ├── components/     # Reusable components
    │   ├── home/      # Home page components
    │   │   ├── AboutSection.js
    │   │   ├── FeaturedSection.js
    │   │   ├── HeroSection.js
    │   │   └── OrderingSection.js
    │   ├── Navbar.js   # Navigation bar
    │   └── PrivateRoute.js # Protected route wrapper
    ├── context/
    │   └── AuthContext.js # Authentication context
    ├── data/          # Static data
    │   ├── cities.js  # Tunisia cities data
    │   └── states.js  # Tunisia governorates data
    ├── pages/         # Page components
    │   ├── Account.js # User profile page
    │   ├── Auth.css   # Authentication pages styling
    │   ├── Home.js    # Landing page
    │   ├── Login.js   # Login page
    │   ├── OrderPage.js # Pizza ordering page
    │   └── Register.js # Registration page
    ├── App.css        # Main application styles
    ├── App.js         # Main React component
    ├── index.css      # Global styles
    └── index.js       # React entry point
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

#### Seed Data
- `pizzas.js`: Contains initial pizza menu data that can be seeded to the database

### Frontend

#### Pages
- `Home.js`: Landing page with quick order options and featured pizzas
- `OrderPage.js`: Main ordering interface with pizza customization
- `Account.js`: User profile management and order history
- `Login.js` & `Register.js`: Authentication pages

#### Components
- `home/`: Components for the landing page sections
- `Navbar.js`: Navigation and user menu component
- `PrivateRoute.js`: Protected route wrapper for authenticated pages

#### Context
- `AuthContext.js`: Manages user authentication state across the application

#### Data
- `states.js`: List of Tunisia's governorates
- `cities.js`: Cities mapped to their respective governorates

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pizza-petes.git
   cd pizza-petes
   ```

2. Install dependencies:
   ```bash
   # Install all dependencies (both frontend and backend)
   npm install
   ```

3. Environment Configuration:

   Create `.env.development` for development:
   ```
   REACT_APP_API_URL=http://localhost:5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

   Create `.env.production` for production:
   ```
   REACT_APP_API_URL=your_production_api_url
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   PORT=5000
   NODE_ENV=production
   ```

4. Seed the database with initial pizza data:
   ```bash
   npm run seed
   ```

5. Start the development servers:
   ```bash
   # Start both frontend and backend in development mode
   npm run dev
   ```

   The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

6. For production:
   ```bash
   # Build and seed data
   npm run prod:build

   # Start the production server
   npm run prod:start
   ```

## Available Scripts

- `npm start`: Starts the frontend development server
- `npm run server`: Starts the backend server with nodemon for development
- `npm run dev`: Runs both frontend and backend in development mode using concurrently
- `npm run build`: Builds the frontend for production
- `npm run seed`: Seeds the database with initial pizza data
- `npm run prod:build`: Builds frontend and seeds data for production
- `npm run prod:start`: Starts the production server
- `npm test`: Runs the test suite
- `npm run eject`: Ejects from create-react-app (don't use unless necessary)

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
