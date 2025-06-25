import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../lib/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializingRef = useRef(false);
  const lastTokenCheck = useRef(0);

  // Helper function to clear auth state
  const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      // Prevent multiple simultaneous initializations
      if (initializingRef.current) {
        return;
      }

      // Debounce token checks (max once per 5 seconds)
      const now = Date.now();
      if (now - lastTokenCheck.current < 5000) {
        setLoading(false);
        return;
      }

      try {
        initializingRef.current = true;
        lastTokenCheck.current = now;

        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            // Parse stored user first to avoid unnecessary API calls
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser); // Set user immediately to improve UX
            
            // Validate token with backend (with timeout)
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Token validation timeout')), 10000)
            );
            
            const validationPromise = authAPI.getMe();
            const response = await Promise.race([validationPromise, timeoutPromise]);
            
            const userData = response.data.data?.user || response.data.user || response.data;
            setUser(userData);
            
            // Update stored user data if different
            if (JSON.stringify(userData) !== storedUser) {
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } catch (error) {
            console.error('Token validation failed:', error.message);
            
            // Only clear auth state if it's actually an auth error
            if (error.response?.status === 401 || error.message.includes('token')) {
              clearAuthState();
            } else {
              // For network errors, keep the user logged in with cached data
              console.log('Network error during token validation, keeping cached user');
              if (storedUser) {
                try {
                  setUser(JSON.parse(storedUser));
                } catch (parseError) {
                  console.error('Failed to parse stored user:', parseError);
                  clearAuthState();
                }
              }
            }
          }
        } else {
          // No token or user data, ensure clean state
          clearAuthState();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Don't clear auth state for network errors
        if (error.message.includes('auth') || error.message.includes('401')) {
          clearAuthState();
        }
      } finally {
        setLoading(false);
        initializingRef.current = false;
      }
    };

    initAuth();
  }, []);
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data.data || response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      // Update last token check to prevent immediate validation
      lastTokenCheck.current = Date.now();
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      
      // Only clear auth data if it's an actual auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthState();
      }
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      const { token, user } = response.data.data || response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      // Update last token check
      lastTokenCheck.current = Date.now();
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthState();
    // Reset token check timestamp
    lastTokenCheck.current = 0;
    // Force page reload to ensure clean state
    window.location.href = '/';
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await authAPI.forgotPassword(email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Forgot password failed:', error);
      setError(error.response?.data?.message || 'Failed to send reset email');
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      await authAPI.resetPassword(token, password);
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      console.error('Reset password failed:', error);
      setError(error.response?.data?.message || 'Password reset failed');
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      await authAPI.changePassword({ oldPassword, newPassword });
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password failed:', error);
      setError(error.response?.data?.message || 'Password change failed');
      return {
        success: false,
        error: error.response?.data?.message || 'Password change failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    clearError,
    isAuthenticated: !!user,
    clearAuthState // Expose for manual cleanup if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
