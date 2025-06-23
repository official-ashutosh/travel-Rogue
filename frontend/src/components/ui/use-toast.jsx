import { useState } from 'react';

// Simple toast hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ description, variant = "default", duration = 3000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    
    // Show browser notification for now
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(description);
    } else {
      // Fallback to console log
      console.log('Toast:', description);
    }
  };

  return { toast, toasts };
};
