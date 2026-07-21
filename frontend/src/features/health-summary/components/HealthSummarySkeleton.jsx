/**
 * PulseCare AI - HealthSummarySkeleton Component
 */

import React from 'react';

export const HealthSummarySkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      {/* Top Banner Skeleton */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 h-36 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 w-48 bg-accent/60 rounded-xl" />
          <div className="h-8 w-24 bg-accent/60 rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-accent/40 rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border/60 rounded-3xl p-6 h-64 bg-accent/30" />
        <div className="lg:col-span-2 bg-card border border-border/60 rounded-3xl p-6 h-64 bg-accent/30" />
      </div>

      {/* Vitals Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-3xl p-4 h-28 bg-accent/30" />
        ))}
      </div>
    </div>
  );
};

export default HealthSummarySkeleton;
