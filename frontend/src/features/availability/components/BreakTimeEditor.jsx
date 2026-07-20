import React from 'react';
import { Coffee } from 'lucide-react';
import { formatTimeDisplay } from '../utils/availability.utils';

/**
 * Visual-only break time indicator (frontend UX — no backend storage).
 * Displays a break interval within a working block for the slot preview.
 */
export const BreakTimeEditor = ({
  breakStart,
  breakEnd,
  onBreakStartChange,
  onBreakEndChange,
}) => {
  return (
    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 space-y-3">
      <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
        <Coffee className="w-4 h-4" />
        <span>Break / Lunch Time</span>
        <span className="text-[10px] font-normal text-muted-foreground ml-1">(optional — slots excluded from booking)</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">Break Start</label>
          <input
            type="time"
            value={breakStart || ''}
            onChange={(e) => onBreakStartChange?.(e.target.value)}
            className="w-full px-3 py-2 bg-accent/30 border border-amber-500/30 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">Break End</label>
          <input
            type="time"
            value={breakEnd || ''}
            onChange={(e) => onBreakEndChange?.(e.target.value)}
            className="w-full px-3 py-2 bg-accent/30 border border-amber-500/30 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-amber-400/40 focus:outline-none"
          />
        </div>
      </div>

      {breakStart && breakEnd && (
        <p className="text-[11px] text-muted-foreground">
          Break from{' '}
          <span className="font-bold text-foreground">{formatTimeDisplay(breakStart)}</span>{' '}
          to{' '}
          <span className="font-bold text-foreground">{formatTimeDisplay(breakEnd)}</span>{' '}
          — slots during this period will be excluded.
        </p>
      )}
    </div>
  );
};

export default BreakTimeEditor;
