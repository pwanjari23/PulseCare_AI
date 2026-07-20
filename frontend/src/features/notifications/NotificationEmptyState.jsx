import React from 'react';
import { BellOff, CheckCircle2 } from 'lucide-react';

export const NotificationEmptyState = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="py-8 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
        <p className="text-xs text-muted-foreground">You are all caught up! No unread notifications.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/60 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto text-muted-foreground">
        <BellOff className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-foreground">No Notifications Available</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        No notifications match your active filter or search criteria.
      </p>
    </div>
  );
};

export default NotificationEmptyState;
