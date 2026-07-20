import React from 'react';

export const AvailabilitySkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-card border border-border/60 rounded-3xl p-4 space-y-2">
            <div className="h-3 bg-accent/60 rounded w-2/3" />
            <div className="h-6 bg-accent/40 rounded w-1/2" />
          </div>
        ))}
      </div>

      {/* Day cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-40 bg-card border border-border/60 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-accent/60 rounded w-24" />
              <div className="h-5 w-12 bg-accent/40 rounded-full" />
            </div>
            <div className="h-3 bg-accent/40 rounded w-3/4" />
            <div className="h-3 bg-accent/40 rounded w-1/2" />
            <div className="flex space-x-2 pt-2">
              <div className="h-7 bg-accent/40 rounded-xl flex-1" />
              <div className="h-7 w-7 bg-accent/40 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySkeleton;
