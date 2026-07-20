import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const DashboardErrorState = ({
  title = 'Failed to Load Content',
  message = 'An unexpected server error occurred while retrieving data.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`bg-card border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground font-display">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
};

export default DashboardErrorState;
