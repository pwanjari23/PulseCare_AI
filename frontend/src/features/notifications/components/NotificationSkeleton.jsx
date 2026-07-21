import React from 'react';

export const NotificationSkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-3 font-sans">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="h-24 bg-card border border-border/60 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
};

export default NotificationSkeleton;
