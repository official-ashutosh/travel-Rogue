import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeProvider.jsx';
import { MapProvider } from './contexts/MapProvider.jsx';
import AuthErrorBoundary from './components/AuthErrorBoundary.jsx';
import './styles/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <MapProvider>
              <App />
            </MapProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AuthErrorBoundary>
  </React.StrictMode>
);
