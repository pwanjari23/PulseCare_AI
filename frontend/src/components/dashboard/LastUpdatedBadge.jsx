import React from 'react';
import { Clock } from 'lucide-react';

export const LastUpdatedBadge = ({ timestamp = new Date() }) => {
  const timeStr = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-muted-foreground bg-accent/40 px-2 py-0.5 rounded-full border border-border/40">
      <Clock className="w-3 h-3 text-primary" />
      <span>Updated at {timeStr}</span>
    </span>
  );
};

export default LastUpdatedBadge;
