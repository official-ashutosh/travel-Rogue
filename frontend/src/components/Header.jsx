import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { cn } from '../lib/utils.js';
import { Button } from './ui/Button.jsx';
import Logo from './common/Logo.jsx';
import ThemeDropdown from './ThemeDropdown.jsx';
import FeedbackSheet from './common/FeedbackSheet.jsx';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  const isDashboard = location.pathname.startsWith('/dashboard');

  const navLinks = [
    { id: 'how-it-works', text: 'How it works' },
    { id: 'public-plans', text: 'Community Plans' },
    { id: 'pricing', text: 'Pricing' }
  ];

  const handleSignOut = () => {
    logout();
  };

  return (
    <header
      className={cn(
        "w-full border-b border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-between w-full items-center">
          {/* Logo */}
          <Logo />

          {/* Navigation Links - Only show on home page */}
          {isHomePage && (
            <div className="hidden md:flex items-center flex-1 justify-center">
              <ul className="flex gap-8 items-center text-sm">
                {navLinks.map((link) => (
                  <li
                    key={link.id}
                    className="hover:underline cursor-pointer transition-all hover:text-blue-600"
                  >
                    <a href={`#${link.id}`}>{link.text}</a>
                  </li>
                ))}
                <li className="hover:underline cursor-pointer transition-all hover:text-blue-600">
                  <Link to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          )}          {/* Auth Section */}
          <div className="flex gap-4 justify-end items-center">
            {/* Theme Toggle - Always visible */}
            <ThemeDropdown />
            
            {/* Feedback - Always visible */}
            <FeedbackSheet />
            
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {!isDashboard && (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Link to="/community-plans">
                  <Button variant="ghost" size="sm">
                    Community Plans
                  </Button>
                </Link>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || user?.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
