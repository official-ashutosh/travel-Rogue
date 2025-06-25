import React from 'react';

class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Only handle specific auth-related errors
    const isAuthError = error.message?.includes('auth') || 
                       error.message?.includes('token') ||
                       error.message?.includes('401') ||
                       error.name === 'AuthError';
    
    if (isAuthError) {
      return { hasError: true, error };
    }
    
    // Let other errors bubble up
    throw error;
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth Error Boundary caught:', error, errorInfo);
    
    // Only clear auth state for actual auth errors
    const isAuthError = error.message?.includes('auth') || 
                       error.message?.includes('token') ||
                       error.message?.includes('401') ||
                       error.name === 'AuthError';
    
    if (isAuthError) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Authentication Error</h2>
            <p className="text-muted-foreground mb-4">
              There was an issue with your session. Please try logging in again.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
