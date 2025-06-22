import React from 'react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ size = 'default', className, ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center" {...props}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
