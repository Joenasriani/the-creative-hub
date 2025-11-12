
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 transition-all duration-300 relative ${className}`}>
      {children}
    </div>
  );
};

export default Card;
