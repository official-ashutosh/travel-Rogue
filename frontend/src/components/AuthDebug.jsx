import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const AuthDebug = () => {
  const { user, loading, error, isAuthenticated } = useAuth();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-[9999] max-w-xs">
      <div>Auth Debug:</div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? user.email : 'null'}</div>
      <div>Token: {localStorage.getItem('token') ? 'exists' : 'null'}</div>
      {error && <div className="text-red-300">Error: {error}</div>}
    </div>
  );
};

export default AuthDebug;
