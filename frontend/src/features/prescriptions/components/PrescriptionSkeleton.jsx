import React from 'react';

export const PrescriptionSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-card border border-border/60 rounded-3xl animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-32 bg-card border border-border/60 rounded-3xl animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionSkeleton;
