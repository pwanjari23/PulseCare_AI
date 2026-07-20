import React from 'react';
import { Bell, ShieldCheck, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAdminGreeting, formatAdminDate } from './dashboard.utils';

export const AdminDashboardHeader = ({ user, unreadCount = 0 }) => {
  const greeting = getAdminGreeting(user?.firstName || 'Administrator');
  const formattedDate = formatAdminDate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>{formattedDate} • Platform Control Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight">
          {greeting} 👋
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>PulseCare AI engine is operating normally at 99.98% uptime.</span>
        </p>
      </div>

      <div className="flex items-center space-x-3 z-10 self-start sm:self-center">
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-accent/40 border border-border/60 text-xs font-mono font-bold text-muted-foreground">
          <Server className="w-3.5 h-3.5 text-primary" />
          <span>v1.4.2 Enterprise</span>
        </div>

        <Link
          to="/notifications"
          className="relative p-2.5 rounded-2xl bg-accent/60 hover:bg-accent border border-border/60 text-foreground transition-all duration-200"
          title="View Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center border-2 border-card">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-accent/30 border border-border/50">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
            Admin
          </div>
          <div className="text-left hidden md:block">
            <span className="text-xs font-bold text-foreground block">{user?.firstName || 'System'} {user?.lastName || 'Admin'}</span>
            <span className="text-[10px] text-muted-foreground font-mono">Superuser</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
