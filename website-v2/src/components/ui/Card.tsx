import React, { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  className = '',
  hoverEffect = true
}) => {
  return (
    <div className={`card ${hoverEffect ? 'hover-effect' : ''} ${className}`}>
      {icon && <div className="card-icon">{icon}</div>}
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
