import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-28 bg-card border border-border/60 rounded-3xl p-6" />

      {/* Platform Statistics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-24 bg-card border border-border/60 rounded-2xl p-4" />
        ))}
      </div>

      {/* Main Widgets Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-card border border-border/60 rounded-3xl p-6" />
        <div className="h-64 bg-card border border-border/60 rounded-3xl p-6" />
      </div>

      {/* Analytics Chart Skeleton */}
      <div className="h-72 bg-card border border-border/60 rounded-3xl p-6" />
    </div>
  );
};

export default DashboardSkeleton;
