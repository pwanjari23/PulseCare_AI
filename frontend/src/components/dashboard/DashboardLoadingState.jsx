import React from 'react';
import WidgetSkeleton from './WidgetSkeleton';

export const DashboardLoadingState = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-28 bg-card border border-border/60 rounded-3xl p-6" />

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-card border border-border/60 rounded-2xl p-4" />
        ))}
      </div>

      {/* Dashboard Widgets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetSkeleton height="h-64" />
        <WidgetSkeleton height="h-64" />
      </div>
    </div>
  );
};

export default DashboardLoadingState;
