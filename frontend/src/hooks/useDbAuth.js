import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocation } from 'react-router-dom';

const useDbAuth = () => {
  const { user, login, logout, loading } = useAuth();
  const [isCurrentPathDashboard, setIsCurrentPathDashboard] = useState(false);
  const [isCurrentPathHome, setIsCurrentPathHome] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsCurrentPathDashboard(location.pathname.startsWith('/dashboard'));
    setIsCurrentPathHome(location.pathname === '/');
  }, [location]);

  const signIn = () => {
    // Redirect to login page
    window.location.href = '/login';
  };

  const signUp = () => {
    // Redirect to signup page
    window.location.href = '/signup';
  };

  const signOut = () => {
    logout();
    window.location.href = '/';
  };

  return {
    isAuthenticated: !!user,
    user,
    isCurrentPathDashboard,
    isCurrentPathHome,
    signIn,
    signUp,
    signOut,
    loading
  };
};

export default useDbAuth;
