import React, { ReactNode } from 'react';

interface CollapsibleCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ title, icon, children, isOpen, onToggle }) => {

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50 transition-colors duration-300`}>
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <div className="h-8 w-8">{icon}</div>
          <h3 className="ml-4 text-xl font-bold text-white">{title}</h3>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
      >
        <div className="px-6 pb-6 border-t border-gray-700/50">
            {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;
