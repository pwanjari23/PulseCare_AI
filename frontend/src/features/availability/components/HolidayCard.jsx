import React from 'react';
import { Trash2, CalendarX, RefreshCw } from 'lucide-react';

export const HolidayCard = ({ holiday, onDelete }) => {
  const isUpcoming = new Date(holiday.date) >= new Date(new Date().toDateString());

  return (
    <div className={`bg-card border rounded-2xl p-4 shadow-sm flex items-start justify-between space-x-3 transition-colors ${
      isUpcoming ? 'border-rose-500/25 bg-rose-500/5' : 'border-border/50 opacity-70'
    }`}>
      <div className="flex items-start space-x-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isUpcoming ? 'bg-rose-500/10 text-rose-500' : 'bg-accent/60 text-muted-foreground'
        }`}>
          <CalendarX className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{holiday.reason || 'Holiday'}</p>
          <p className="text-[11px] text-muted-foreground font-mono">
            {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          {holiday.recurring && (
            <span className="inline-flex items-center space-x-1 text-[10px] text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2 py-0.5 mt-1">
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Recurring annually</span>
            </span>
          )}
          {!isUpcoming && (
            <span className="text-[10px] text-muted-foreground bg-accent/40 px-2 py-0.5 rounded-full mt-1 inline-block">Past</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete?.(holiday)}
        className="flex-shrink-0 p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
        aria-label={`Delete holiday: ${holiday.reason}`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default HolidayCard;
