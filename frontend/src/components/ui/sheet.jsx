import React, { useEffect } from 'react';
import { cn } from '../../lib/utils.js';

const Sheet = ({ children, open, onOpenChange }) => {
  const [triggerElement, contentElement] = React.Children.toArray(children);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleTriggerClick = () => {
    onOpenChange?.(!open);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange?.(false);
    }
  };

  const handleClose = () => {
    onOpenChange?.(false);
  };

  return (
    <>
      {React.cloneElement(triggerElement, { onClick: handleTriggerClick })}
      
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />
          
          {/* Sheet Content */}
          {React.cloneElement(contentElement, { onClose: handleClose })}
        </div>
      )}
    </>
  );
};

const SheetTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
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
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef(({ className, children, onClose, ...props }, ref) => (
  <div
    className={cn(
      "fixed inset-y-0 right-0 z-50 h-full w-3/4 gap-4 border-l bg-white dark:bg-gray-800 p-6 shadow-lg transition-transform duration-300 ease-in-out translate-x-0 sm:max-w-sm",
      className
    )}
    ref={ref}
    {...props}
  >
    <div className="relative h-full">
      {children}
    </div>
  </div>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h2
    className={cn("text-lg font-semibold text-gray-900 dark:text-white", className)}
    ref={ref}
    {...props}
  >
    {children}
  </h2>
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    ref={ref}
    {...props}
  >
    {children}
  </p>
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
