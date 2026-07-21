/**
 * PulseCare AI - DashboardSkeleton Component
 */

import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center h-12">
        <div className="h-8 w-64 bg-accent/60 rounded-2xl" />
        <div className="h-8 w-36 bg-accent/60 rounded-2xl" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-3xl p-5 h-32 bg-accent/30" />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-3xl p-6 h-72 bg-accent/30" />
        <div className="bg-card border border-border/60 rounded-3xl p-6 h-72 bg-accent/30" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
