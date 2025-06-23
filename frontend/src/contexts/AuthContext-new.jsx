import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await authAPI.getMe();
          setUser(response.data);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await authAPI.register({ name, email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.response?.data?.message || 'Signup failed');
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'Signup failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
    isAuthenticated: !!user
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
