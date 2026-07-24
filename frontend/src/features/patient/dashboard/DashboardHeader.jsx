import React from 'react';
import { Sparkles } from 'lucide-react';
import { getTimeOfDayGreeting, formatDashboardDate } from './dashboard.utils';

export const DashboardHeader = ({ user, unreadCount = 0 }) => {
  const greeting = getTimeOfDayGreeting();
  const firstName = user?.firstName || 'Patient';
  const formattedDate = formatDashboardDate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      {/* Background Accent Gradient Glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-1 z-10">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{formattedDate}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight">
          {greeting}, <span className="text-primary">{firstName}</span> 👋
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Take care of your health today. Here is your real-time physiological telemetry summary.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
