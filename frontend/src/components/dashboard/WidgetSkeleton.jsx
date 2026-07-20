import React from 'react';

export const WidgetSkeleton = ({ height = 'h-64', className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-6 animate-pulse space-y-4 ${height} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-accent rounded w-1/3" />
        <div className="h-4 bg-accent rounded w-12" />
      </div>
      <div className="h-full bg-accent/40 rounded-2xl" />
    </div>
  );
};

export default WidgetSkeleton;
