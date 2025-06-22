import React from 'react';
import { ACTIVITY_PREFERENCES } from '../../lib/constants.js';
import { Badge } from '../ui/Badge.jsx';

const ActivityPreferences = ({ 
  values = [], 
  onChange, 
  className = '',
  activityClassName = '' 
}) => {
  const handleToggle = (id) => {
    const newValues = values.includes(id)
      ? values.filter(v => v !== id)
      : [...values, id];
    onChange(newValues);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Preferences</h3>
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_PREFERENCES.map((activity) => (
          <Badge
            key={activity.id}
            variant={values.includes(activity.id) ? 'default' : 'outline'}
            className={`cursor-pointer transition-colors hover:bg-blue-100 dark:hover:bg-blue-900 ${activityClassName}`}
            onClick={() => handleToggle(activity.id)}
          >
            {activity.icon && <activity.icon className="w-3 h-3 mr-1" />}
            {activity.displayName}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ActivityPreferences;
