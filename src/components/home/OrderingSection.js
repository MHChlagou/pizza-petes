import React from 'react';
import { PlusCircle, Heart, Sparkles } from 'lucide-react';

const OrderCard = React.memo(({ icon: Icon, title, description, onClick, buttonText }) => (
  <div 
    className="option-card" 
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '35px 25px',
      height: '100%',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default'
    }}
  >
    <div style={{ width: '100%', textAlign: 'center' }}>
      <div className="option-icon" style={{ marginBottom: '25px' }}>
        <Icon size={38} />
      </div>
      <h3 style={{ 
        fontSize: '1.4em', 
        marginBottom: '15px',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: '1.1em',
        lineHeight: '1.5',
        color: '#636e72',
        marginBottom: '30px'
      }}>
        {description}
      </p>
    </div>
    <button 
      onClick={onClick}
      className="btn btn-primary"
      style={{
        padding: '12px 30px',
        fontSize: '1.1em',
        fontWeight: '500',
        width: 'auto',
        minWidth: '180px',
        transition: 'all 0.2s ease',
        marginTop: 'auto'
      }}
    >
      {buttonText}
    </button>
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
    if (!user) return 'Sign in to quickly reorder from your favorite pizza selections';
    if (isLoading) return 'Loading your favorite orders...';
    return favorites.length > 0 
      ? 'Quickly reorder your favorite pizza combinations' 
      : 'Start creating your collection of favorite orders';
  };

  const cards = [
    {
      icon: PlusCircle,
      title: 'Create New Order',
      description: 'Design your perfect pizza with our wide selection of fresh ingredients and customization options',
      onClick: onNewOrder,
      buttonText: 'Start Order'
    },
    {
      icon: Heart,
      title: 'Reorder Favorite',
      description: getFavoriteDescription(),
      onClick: onReorderFave,
      buttonText: 'Order Favorite'
    },
    {
      icon: Sparkles,
      title: 'Surprise Order',
      description: 'Let our expert chefs surprise you with a specially crafted pizza creation',
      onClick: onSurpriseMe,
      buttonText: 'Surprise Me'
    }
  ];

  return (
    <div className="ordering-section" style={{ padding: '80px 20px' }}>
      <h2 style={{
        color: '#2d3436',
        fontSize: '2.2em',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '50px',
        letterSpacing: '0.5px'
      }}>
        Quick Order Options
      </h2>
      <div className="quick-options" style={{
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
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
