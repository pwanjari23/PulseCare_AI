import React from 'react';
import { ShieldCheck, Server } from 'lucide-react';
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
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
