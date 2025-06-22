import React from 'react';

const Pulse = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
  );
};

export default Pulse;
