/**
 * PulseCare AI - NotificationStatistics Component
 */

import React from 'react';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';

export const NotificationStatistics = ({ data, className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <Bell className="w-4 h-4 text-teal-500" /> System Notification Broadcast Metrics
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Notifications Sent</span>
          <p className="text-lg font-black text-foreground font-mono">{data?.totalNotificationsCount || 0}</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Delivery Success Rate</span>
          <p className="text-lg font-black text-emerald-500 font-mono">99.4%</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Critical Vital Alerts</span>
          <p className="text-lg font-black text-rose-500 font-mono">{data?.openAlertsCount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationStatistics;
