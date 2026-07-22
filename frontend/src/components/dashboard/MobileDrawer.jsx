import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { useUiStore } from '../../stores/ui.store';
import { getNavigationForRole } from '../../constants/navigation';
import SidebarGroup from './SidebarGroup';
import { useQueryClient } from '@tanstack/react-query';

export const MobileDrawer = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { sidebarOpen, setSidebar } = useUiStore();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const navigation = getNavigationForRole(user?.role);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebar(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, setSidebar]);

  const handleLogout = async () => {
    setSidebar(false);
    await logout(queryClient);
    navigate('/login');
  };

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'PulseCare User';
  const userRole = user?.role || 'Patient';

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebar(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border/60 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
              <Link to="/" onClick={() => setSidebar(false)} className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md shadow-primary/20">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-primary to-healing-500 bg-clip-text text-transparent">
                  PulseCare AI
                </span>
              </Link>
              <button
                onClick={() => setSidebar(false)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Close Mobile Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="p-4 border-b border-border/40 bg-accent/30 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-foreground truncate">{userName}</h4>
                <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block truncate">
                  {userRole}
                </span>
              </div>
            </div>

            {/* Nav Groups */}
            <nav className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
              {navigation.map((group, idx) => (
                <SidebarGroup
                  key={idx}
                  group={group}
                  collapsed={false}
                  onItemClick={() => setSidebar(false)}
                />
              ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-border/50 space-y-1 bg-card">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
