import React from 'react';
import { PlusCircle, Heart, Sparkles } from 'lucide-react';

const OrderCard = React.memo(({ icon: Icon, title, description, onClick, buttonText }) => (
  <div className="option-card" onClick={onClick}>
    <div className="option-icon">
      <Icon size={32} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    <button className="btn btn-primary">{buttonText}</button>
  </div>
));

const OrderingSection = ({ 
  user, 
  favorites = [], 
  isLoading, 
  onNewOrder, 
  onReorderFave, 
  onSurpriseMe 
}) => {
  const getFavoriteDescription = () => {
    if (!user) return 'Login to access your favorites';
    if (isLoading) return 'Loading your favorites...';
    return favorites.length > 0 
      ? 'Quick order from your saved favorites' 
      : 'No favorites yet - create some!';
  };

  const cards = [
    {
      icon: PlusCircle,
      title: 'NEW ORDER',
      description: 'Create your perfect pizza from scratch',
      onClick: onNewOrder,
      buttonText: 'START FRESH'
    },
    {
      icon: Heart,
      title: 'RE-ORDER FAVORITE',
      description: getFavoriteDescription(),
      onClick: onReorderFave,
      buttonText: 'ORDER AGAIN'
    },
    {
      icon: Sparkles,
      title: 'SURPRISE ME',
      description: 'Try our chef\'s special creation',
      onClick: onSurpriseMe,
      buttonText: 'SURPRISE ME'
    }
  ];

  return (
    <div className="ordering-section">
      <h2>Quick Order Options</h2>
      <div className="quick-options">
        {cards.map((card, index) => (
          <OrderCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            onClick={card.onClick}
            buttonText={card.buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(OrderingSection);
