import React from 'react';

const DateRangeSelector = ({ 
  value = { from: null, to: null }, 
  onChange, 
  className = '' 
}) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const handleFromChange = (e) => {
    onChange({
      ...value,
      from: e.target.value ? new Date(e.target.value) : null
    });
  };

  const handleToChange = (e) => {
    onChange({
      ...value,
      to: e.target.value ? new Date(e.target.value) : null
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Travel Dates</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">From</label>
          <input
            type="date"
            value={value.from ? value.from.toISOString().split('T')[0] : ''}
            onChange={handleFromChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">To</label>
          <input
            type="date"
            value={value.to ? value.to.toISOString().split('T')[0] : ''}
            onChange={handleToChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      {value.from && value.to && (
        <p className="text-xs text-gray-500">
          {formatDate(value.from)} - {formatDate(value.to)}
        </p>
      )}
    </div>
  );
};

export default DateRangeSelector;
