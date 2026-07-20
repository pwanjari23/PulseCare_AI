import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Activity, LogOut, User, Sun, Moon } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary-text group">
              <div className="p-2 rounded-lg bg-medical-600/10 text-medical-600 group-hover:scale-105 transition-transform duration-300">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-display bg-gradient-to-r from-primary-text to-muted-text bg-clip-text text-transparent">
                PulseCare <span className="text-medical-600 font-extrabold text-2xl">AI</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-medical-600 font-semibold' : 'text-muted-text hover:text-primary-text'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive('/dashboard') ? 'text-medical-600 font-semibold' : 'text-muted-text hover:text-primary-text'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border-subtle bg-surface hover:bg-hover text-muted-text hover:text-primary-text transition-all cursor-pointer shadow-sm active:scale-95"
              title="Toggle Theme Mode"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-warning-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <span className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-secondary-text">
                  <User className="h-4 w-4 text-medical-600" />
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-muted-text hover:text-danger-500 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-secondary-text hover:text-primary-text transition-colors cursor-pointer px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm tracking-wide px-5 py-2.5 rounded-xl shadow-md shadow-medical-600/25 transition-all duration-300 cursor-pointer active:scale-97"
                >
                  Join Platform
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
