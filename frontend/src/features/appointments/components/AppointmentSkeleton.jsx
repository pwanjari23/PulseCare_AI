import React from 'react';

export const AppointmentSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-52 bg-card border border-border/60 rounded-3xl p-5 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/60" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-accent/60 rounded w-2/3" />
              <div className="h-2.5 bg-accent/40 rounded w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-xl bg-accent/40" />
            <div className="h-12 rounded-xl bg-accent/40" />
          </div>
          <div className="h-3 bg-accent/40 rounded w-3/4" />
          <div className="h-8 rounded-xl bg-accent/40 mt-auto" />
        </div>
      ))}
    </div>
  );
};

export default AppointmentSkeleton;
