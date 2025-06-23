import React from 'react';
import { cn } from '../../lib/utils.js';

const Popover = ({ children, open, onOpenChange, ...props }) => {
  return (
    <div className="relative" {...props}>
      {children}
    </div>
  );
};

const PopoverTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children, { ...props, ref });
  }
  
  return (
    <button
      className={cn("", className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ 
  className, 
  align = "center", 
  side = "bottom",
  collisionPadding = 0,
  children, 
  ...props 
}, ref) => (
  <div
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </div>
));
PopoverContent.displayName = "PopoverContent";

export {
  Popover,
  PopoverContent,
  PopoverTrigger,
};
