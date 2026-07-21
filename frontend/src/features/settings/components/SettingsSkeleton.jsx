/**
 * PulseCare AI - SettingsSkeleton Component
 */

import React from 'react';

export const SettingsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      <div className="h-12 bg-accent/40 rounded-3xl w-1/3" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 h-64 bg-accent/30 rounded-3xl shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-28 bg-accent/30 rounded-3xl" />
          <div className="h-72 bg-accent/30 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;
