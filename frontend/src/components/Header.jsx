import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { cn } from '../lib/utils.js';
import { Button } from './ui/Button.jsx';
import Logo from './common/Logo.jsx';
import ThemeDropdown from './ThemeDropdown.jsx';
import { 
  ChevronDown, 
  User, 
  CreditCard, 
  DollarSign, 
  MessageSquare, 
  UserPlus,
  ShieldCheck,
  LogOut
} from 'lucide-react';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  
  const isHomePage = location.pathname === '/';
  const isAuthenticated = !!user;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setShowUserMenu(false);
  }, [location]);

  const handleSignOut = () => {
    setShowUserMenu(false);
    logout();
  };

  // Don't render auth buttons while loading
  if (loading) {
    return (
      <header className={cn(
        "w-full border-b border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}>
        <nav className="lg:px-20 px-5 py-3 mx-auto relative">
          <div className="flex justify-between w-full items-center gap-4 relative">
            <Logo />
            <div className="flex gap-4 justify-end items-center min-w-[180px]">
              <ThemeDropdown />
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  const navLinks = [
    { id: 'how-it-works', text: 'How it works' },
    { id: 'community-plans', text: 'Community Plans' },
    { id: 'pricing', text: 'Pricing' }
  ];

  const userMenuItems = [
    ...(user?.role === 'user' ? [
      { 
        icon: User, 
        label: 'Dashboard', 
        href: '/dashboard' 
      },
      { 
        icon: DollarSign, 
        label: 'Expenses', 
        href: '/expenses' 
      },
      { 
        icon: CreditCard, 
        label: 'Payments', 
        href: '/payments' 
      },
      { 
        icon: MessageSquare, 
        label: 'Feedback', 
        href: '/feedback' 
      },
      { 
        icon: UserPlus, 
        label: 'Invites', 
        href: '/invite' 
      }
    ] : []),
    ...(user?.role === 'admin' ? [{ 
      icon: ShieldCheck, 
      label: 'Admin Dashboard', 
      href: '/admin' 
    }] : [])
  ];

  return (
    <header
      className={cn(
        "w-full border-b border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
      style={{ minHeight: 44 }} // ensure enough height for sticky offset
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto relative">        <div className="flex justify-between w-full items-center gap-4 relative">
          {/* Logo */}
          <Logo />

          {/* Home button when not on homepage */}
          {!isHomePage && (
            <div className="hidden md:flex items-center">
              <Link 
                to="/" 
                className="text-base font-medium hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                Home
              </Link>
            </div>
          )}

          {/* Navigation Links - Only show on home page */}
          {isHomePage && (
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none">
              <ul className="flex gap-10 items-center text-base font-medium justify-center pointer-events-auto">
                {navLinks.map((link) => (
                  <li
                    key={link.id}
                    className="hover:underline cursor-pointer transition-all hover:text-blue-600"
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={e => {
                        e.preventDefault();
                        if (isHomePage) {
                          const section = document.getElementById(link.id);
                          if (section) {
                            section.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          window.location.href = `/#${link.id}`;
                        }
                      }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Auth Section */}
          <div className="flex gap-4 justify-end items-center min-w-[180px]">
            {/* Theme Toggle - Always visible */}
            <ThemeDropdown />
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
                {/* User Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{user?.name || user?.email}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      showUserMenu && "rotate-180"
                    )} />
                  </Button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      {userMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        );
                      })}
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
