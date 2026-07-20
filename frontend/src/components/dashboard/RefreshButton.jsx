import React from 'react';
import { RefreshCw } from 'lucide-react';

export const RefreshButton = ({ onRefresh, isRefreshing = false, className = '' }) => {
  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className={`p-2 rounded-xl bg-card border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors ${className}`}
      title="Refresh Dashboard Data"
    >
      <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
    </button>
  );
};

export default RefreshButton;
