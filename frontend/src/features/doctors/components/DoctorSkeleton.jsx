import React from 'react';

export const DoctorSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-56 bg-card border border-border/60 rounded-3xl p-5" />
      ))}
    </div>
  );
};

export default DoctorSkeleton;
