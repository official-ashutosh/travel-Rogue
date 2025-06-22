import React from 'react';

const List = ({ items = [], className = '' }) => {
  if (!items || items.length === 0) {
    return (
      <div className={`text-gray-500 dark:text-gray-400 ${className}`}>
        No items to display
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-start space-x-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
          <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default List;
