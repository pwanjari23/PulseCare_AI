import React from 'react';

export const NotificationBadge = ({ count = 0 }) => {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full bg-rose-500 text-white font-mono font-extrabold text-[10px] flex items-center justify-center border-2 border-card ring-2 ring-rose-500/20 animate-pulse">
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
