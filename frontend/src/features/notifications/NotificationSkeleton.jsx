import React from 'react';

export const NotificationSkeleton = ({ count = 4 }) => {
  return (
    <div className="space-y-2.5 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3.5 rounded-2xl bg-card border border-border/60 flex items-start space-x-3"
        >
          <div className="w-8 h-8 rounded-xl bg-accent shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-accent rounded w-1/3" />
            <div className="h-3 bg-accent rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
