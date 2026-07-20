import React from 'react';

export const AvailabilityStatusBadge = ({ isAvailable = true }) => {
  return isAvailable ? (
    <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>Active</span>
    </span>
  ) : (
    <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border bg-rose-500/10 text-rose-500 border-rose-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      <span>Disabled</span>
    </span>
  );
};

export default AvailabilityStatusBadge;
