import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronRight, AlertTriangle } from 'lucide-react';

export const NotificationSummaryCard = ({ count = 89 }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-foreground font-display">Notification Center Summary</h3>
        </div>
        <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          Broadcast System
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>Scheduled System Maintenance</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Maintenance window planned for Sunday at 02:00 AM UTC. Database backup and cache purging will run automatically.
        </p>
      </div>

      <Link
        to="/notifications"
        className="w-full py-2.5 px-3 bg-accent/60 hover:bg-accent border border-border/60 text-foreground text-xs font-semibold rounded-xl text-center transition-colors flex items-center justify-center space-x-1.5"
      >
        <span>Open Notification Center</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default NotificationSummaryCard;
