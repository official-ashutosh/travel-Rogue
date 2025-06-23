import React from 'react';
import { cn } from '../../lib/utils.js';

const Calendar = React.forwardRef(({ 
  className, 
  month,
  mode = "single",
  numberOfMonths = 1,
  max,
  selected,
  onSelect,
  disabled,
  initialFocus,
  classNames = {},
  ...props 
}, ref) => {
  // Simple calendar placeholder - in a real app you'd use react-day-picker
  const handleDateClick = (date) => {
    if (disabled && disabled(date)) return;
    
    if (mode === "range") {
      if (!selected?.from) {
        onSelect?.({ from: date, to: undefined });
      } else if (!selected?.to) {
        onSelect?.({ from: selected.from, to: date });
      } else {
        onSelect?.({ from: date, to: undefined });
      }
    } else {
      onSelect?.(date);
    }
  };

  // Generate calendar days (simplified)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = month || today;
    
    for (let i = 1; i <= 31; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      if (date.getMonth() !== currentMonth.getMonth()) break;
      
      const isSelected = mode === "range" 
        ? (selected?.from && date.getTime() === selected.from.getTime()) ||
          (selected?.to && date.getTime() === selected.to.getTime())
        : selected && date.getTime() === selected.getTime();
      
      const isDisabled = disabled && disabled(date);
      
      days.push(
        <button
          key={i}
          className={cn(
            "h-10 w-10 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
            classNames.day,
            isSelected && "bg-primary text-primary-foreground",
            isDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !isDisabled && handleDateClick(date)}
          disabled={isDisabled}
        >
          {i}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div
      className={cn("p-3", className)}
      ref={ref}
      {...props}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {(month || new Date()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-10 w-10 text-center text-sm font-medium text-muted-foreground flex items-center justify-center">
              {day}
            </div>
          ))}
          {generateCalendarDays()}
        </div>
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar";

export { Calendar };
