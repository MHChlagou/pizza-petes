import React from 'react';

const FeaturedPizza = React.memo(({ image, title, description }) => (
  <div className="featured-pizza">
    <img 
      src={process.env.PUBLIC_URL + image} 
      alt={title}
      width="300"
      height="300"
      loading="lazy"
      decoding="async"
      srcSet={`${process.env.PUBLIC_URL + image} 1x, ${process.env.PUBLIC_URL + image} 2x`}
    />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));

const FeaturedSection = () => {
  const featuredPizzas = [
    {
      image: '/images/pepperoni.png',
      title: 'Classic Pepperoni',
      description: 'Our most popular pizza loaded with premium pepperoni'
    },
    {
      image: '/images/supreme.png',
      title: 'Supreme Special',
      description: 'Loaded with fresh vegetables and premium toppings'
    }
  ];

  return (
    <div className="featured-section">
      <h2>Our Signature Pizzas</h2>
      <div className="featured-pizzas">
        {featuredPizzas.map((pizza, index) => (
          <FeaturedPizza
            key={index}
            image={pizza.image}
            title={pizza.title}
            description={pizza.description}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(FeaturedSection);
