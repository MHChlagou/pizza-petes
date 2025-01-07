import React from 'react';
import { Leaf, Truck, Pizza } from 'lucide-react';

const Feature = React.memo(({ icon: Icon, title, description }) => (
  <div className="feature">
    <div className="feature-icon">
      <Icon size={32} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));

const AboutSection = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      description: 'We use only the freshest ingredients in our pizzas'
    },
    {
      icon: Truck,
      title: 'Quick Delivery',
      description: 'Hot and fresh pizza delivered to your doorstep'
    },
    {
      icon: Pizza,
      title: 'Custom Orders',
      description: 'Create your perfect pizza with our wide range of toppings'
    }
  ];

  return (
    <div className="about-section">
      <h2>Why Choose Pizza Pete's?</h2>
      <div className="features">
        {features.map((feature, index) => (
          <Feature
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(AboutSection);
