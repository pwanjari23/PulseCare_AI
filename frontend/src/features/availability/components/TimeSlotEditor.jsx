import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Reusable time range input pair (Start Time / End Time).
 * Used inside React Hook Form forms via register or Controller.
 */
export const TimeSlotEditor = ({
  startLabel = 'Start Time',
  endLabel = 'End Time',
  startProps = {},
  endProps = {},
  startError,
  endError,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-foreground">
          {startLabel} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Clock className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="time"
            {...startProps}
            className={`w-full pl-8 pr-3 py-2 bg-accent/30 border rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all ${
              startError ? 'border-rose-500/60' : 'border-border/60'
            }`}
          />
        </div>
        {startError && <p className="text-[11px] text-rose-500">{startError}</p>}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-foreground">
          {endLabel} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Clock className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            type="time"
            {...endProps}
            className={`w-full pl-8 pr-3 py-2 bg-accent/30 border rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all ${
              endError ? 'border-rose-500/60' : 'border-border/60'
            }`}
          />
        </div>
        {endError && <p className="text-[11px] text-rose-500">{endError}</p>}
      </div>
    </div>
  );
};

export default TimeSlotEditor;
