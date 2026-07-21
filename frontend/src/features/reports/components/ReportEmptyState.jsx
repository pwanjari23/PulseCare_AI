/**
 * PulseCare AI - ReportEmptyState Component
 */

import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

export const ReportEmptyState = ({ title = 'No Analytical Data Found', description = 'No report data matches your search query or timeframe filters.', onReset }) => {
  return (
    <div className="bg-card border border-border/60 rounded-3xl p-10 text-center space-y-4 font-sans max-w-md mx-auto my-12 shadow-xs">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-2xs">
        <BarChart3 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};

export default ReportEmptyState;
