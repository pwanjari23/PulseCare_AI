/**
 * PulseCare AI - DashboardEmptyState Component
 */

import React from 'react';
import { LayoutDashboard, RefreshCw } from 'lucide-react';

export const DashboardEmptyState = ({ title = 'No Dashboard Data Found', description = 'Try adjusting your search query or refreshing the command center.', onRefresh }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-10 text-center space-y-4 font-sans max-w-lg mx-auto my-12 shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
        <LayoutDashboard className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      )}
    </div>
  );
};

export default DashboardEmptyState;
