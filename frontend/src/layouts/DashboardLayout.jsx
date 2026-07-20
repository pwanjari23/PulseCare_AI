import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  FileText, 
  Bell, 
  Sun, 
  Moon, 
  HeartHandshake
} from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { useThemeStore } from '../stores/theme.store';
import { useUiStore } from '../stores/ui.store';
import { ROUTES } from '../constants/routes';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { sidebarOpen, setSidebar, toggleSidebar } = useUiStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  // Sidebar links based on role
  const getNavLinks = () => {
    const role = user?.role || 'Patient';
    
    const common = [
      { path: '/notifications', label: 'Notifications', icon: Bell },
    ];

    if (role.toLowerCase() === 'doctor') {
      return [
        { path: '/doctor/dashboard', label: 'Doctor Console', icon: LayoutDashboard },
        { path: '/doctor/availability', label: 'My Availability', icon: Clock },
        { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
        ...common
      ];
    }
    
    if (role.toLowerCase() === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Admin Hub', icon: LayoutDashboard },
        ...common
      ];
    }
    
    // Default to patient
    return [
      { path: '/patient/dashboard', label: 'My Health Log', icon: LayoutDashboard },
      { path: '/patient/vitals', label: 'Vitals Tracker', icon: Activity },
      { path: '/patient/appointments', label: 'Book Appointment', icon: Calendar },
      { path: '/patient/prescriptions', label: 'Prescriptions', icon: FileText },
      ...common
    ];
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-screen bg-bg text-primary-text transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-surface border-r border-border-subtle fixed h-screen z-20">
        {/* Brand */}
        <div className="h-[72px] flex items-center px-6 border-b border-border-subtle">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-medical-600/10 text-medical-600 border border-medical-500/20">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">
              PulseCare <span className="text-medical-600">AI</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-6 border-b border-border-subtle bg-bg/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-medical-500/10 text-medical-600 border border-medical-500/20 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h4 className="text-sm font-semibold truncate max-w-[150px]">{user?.name || 'PulseCare User'}</h4>
              <span className="text-[10px] uppercase tracking-wider text-muted-text font-mono font-bold block mt-0.5">
                {user?.role || 'Guest'}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-medical-600 text-white shadow-md shadow-medical-600/20'
                    : 'text-secondary-text hover:bg-bg hover:text-primary-text'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-muted-text'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions inside sidebar */}
        <div className="p-4 border-t border-border-subtle space-y-1">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-secondary-text hover:bg-bg hover:text-primary-text transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun className="h-4.5 w-4.5 text-muted-text" /> : <Moon className="h-4.5 w-4.5 text-muted-text" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-danger-500 hover:bg-danger-500/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-[280px] min-h-screen flex flex-col">
        {/* Top Navbar */}
        <header className="h-[72px] bg-surface/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-15">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebar(true)}
              className="p-2 -ml-2 rounded-xl text-muted-text hover:bg-bg hover:text-primary-text lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold font-display">Console</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-muted-text hover:bg-bg hover:text-primary-text hidden sm:flex cursor-pointer transition-all"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="w-[1px] h-6 bg-border-subtle hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold">{user?.name || 'PulseCare User'}</p>
                <p className="text-[10px] text-muted-text font-mono font-semibold uppercase">{user?.role || 'Guest'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-medical-500/10 text-medical-600 border border-medical-500/20 flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content container */}
        <main className="flex-grow p-6 md:p-8 bg-bg/55">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer (Sidebar) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebar(false)}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            {/* Sidebar content */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-surface z-45 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="h-[72px] flex items-center justify-between px-6 border-b border-border-subtle">
                <Link to="/" className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-medical-600/10 text-medical-600 border border-medical-500/20">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <span className="font-display font-extrabold text-lg tracking-tight">
                    PulseCare <span className="text-medical-600">AI</span>
                  </span>
                </Link>
                <button
                  onClick={() => setSidebar(false)}
                  className="p-2 rounded-xl text-muted-text hover:bg-bg cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Card */}
              <div className="p-6 border-b border-border-subtle bg-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-medical-500/10 text-medical-600 border border-medical-500/20 flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold truncate max-w-[150px]">{user?.name || 'PulseCare User'}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-muted-text font-mono font-bold block mt-0.5">
                      {user?.role || 'Guest'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSidebar(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-medical-600 text-white shadow-md shadow-medical-600/20'
                          : 'text-secondary-text hover:bg-bg hover:text-primary-text'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-muted-text'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer actions */}
              <div className="p-4 border-t border-border-subtle space-y-1">
                <button
                  onClick={() => {
                    toggleTheme();
                    setSidebar(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-secondary-text hover:bg-bg hover:text-primary-text transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {isDark ? <Sun className="h-4.5 w-4.5 text-muted-text" /> : <Moon className="h-4.5 w-4.5 text-muted-text" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-danger-500 hover:bg-danger-500/10 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
