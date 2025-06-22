import React from 'react';
import { COMPANION_PREFERENCES } from '../../lib/constants.js';
import { Button } from '../ui/Button.jsx';

const CompanionControl = ({ 
  value = '', 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Travel Companion</h3>
      <div className="grid grid-cols-2 gap-2">
        {COMPANION_PREFERENCES.map((companion) => (
          <Button
            key={companion.id}
            variant={value === companion.id ? 'default' : 'outline'}
            size="sm"
            className="justify-start"
            onClick={() => onChange(companion.id)}
          >
            {companion.icon && <companion.icon className="w-4 h-4 mr-2" />}
            {companion.displayName}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CompanionControl;
