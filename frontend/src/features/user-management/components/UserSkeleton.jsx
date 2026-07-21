/**
 * PulseCare AI - UserSkeleton Component
 */

import React from 'react';

export const UserSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse font-sans">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-card border border-border/60 rounded-2xl h-20 bg-accent/30" />
        ))}
      </div>
      <div className="bg-card border border-border/60 rounded-3xl p-6 h-96 bg-accent/30" />
    </div>
  );
};

export default UserSkeleton;
