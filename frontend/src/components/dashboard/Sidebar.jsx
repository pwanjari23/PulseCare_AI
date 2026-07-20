import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ChevronLeft, ChevronRight, LogOut, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { getNavigationForRole } from '../../constants/navigation';
import SidebarGroup from './SidebarGroup';
import { useQueryClient } from '@tanstack/react-query';

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const navigation = getNavigationForRole(user?.role);

  const handleLogout = async () => {
    await logout(queryClient);
    navigate('/login');
  };

  const userInitial = user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'PulseCare User';
  const userRole = user?.role || 'Patient';

  return (
    <aside
      className={`hidden lg:flex flex-col bg-card border-r border-border/60 fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        <Link to="/" className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 shadow-md shadow-primary/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-primary to-healing-500 bg-clip-text text-transparent truncate">
              PulseCare AI
            </span>
          )}
        </Link>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User Mini Profile */}
      <div className={`p-3 border-b border-border/40 bg-accent/30 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold shrink-0 text-sm">
            {userInitial}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-foreground truncate">{userName}</h4>
              <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block truncate">
                {userRole}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
        {navigation.map((group, idx) => (
          <SidebarGroup key={idx} group={group} collapsed={isCollapsed} />
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-border/50 space-y-1 bg-card">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500 shrink-0" /> : <Moon className="w-4 h-4 text-indigo-500 shrink-0" />}
          {!isCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
