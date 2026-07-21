/**
 * PulseCare AI - ReportSkeleton Component
 */

import React from 'react';

export const ReportSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      <div className="h-10 bg-accent/40 rounded-2xl w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-3xl h-28 bg-accent/30" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border/60 rounded-3xl h-72 bg-accent/30" />
        <div className="bg-card border border-border/60 rounded-3xl h-72 bg-accent/30" />
      </div>
    </div>
  );
};

export default ReportSkeleton;
