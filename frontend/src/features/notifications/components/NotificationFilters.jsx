import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { NOTIFICATION_FILTER_OPTIONS, DATE_FILTER_OPTIONS } from '../constants/notification.constants';

export const NotificationFilters = ({
  typeFilter,
  onTypeFilterChange,
  dateFilter,
  onDateFilterChange,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 font-sans">
      <div className="flex items-center space-x-1.5 text-xs text-muted-foreground mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-semibold">Filters:</span>
      </div>

      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="px-3 py-1.5 bg-card border border-border/60 rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      >
        {NOTIFICATION_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={dateFilter}
        onChange={(e) => onDateFilterChange(e.target.value)}
        className="px-3 py-1.5 bg-card border border-border/60 rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      >
        {DATE_FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {(typeFilter !== 'all' || dateFilter !== 'all') && (
        <button
          onClick={onReset}
          className="p-1.5 text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent rounded-xl text-xs transition-colors flex items-center space-x-1"
          title="Reset filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Reset</span>
        </button>
      )}
    </div>
  );
};

export default NotificationFilters;
