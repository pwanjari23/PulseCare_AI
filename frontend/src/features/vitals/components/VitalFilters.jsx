import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { DATE_RANGE_OPTIONS } from '../constants/vital.constants';

export const VitalFilters = ({
  dateRange,
  onDateRangeChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 font-sans">
      <div className="flex items-center space-x-1.5 text-xs text-muted-foreground mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-semibold">Filters:</span>
      </div>

      {/* Date range dropdown */}
      <select
        value={dateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="px-3 py-1.5 bg-card border border-border/60 rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      >
        {DATE_RANGE_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {/* Status filter dropdown */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-3 py-1.5 bg-card border border-border/60 rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      >
        <option value="all">All Triage Status</option>
        <option value="normal">Normal</option>
        <option value="warning">Warning</option>
        <option value="critical">Critical</option>
      </select>

      {/* Reset button */}
      {(dateRange !== 'all' || statusFilter !== 'all') && (
        <button
          onClick={onReset}
          className="p-1.5 text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent rounded-xl text-xs transition-colors flex items-center space-x-1"
          title="Reset Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Reset</span>
        </button>
      )}
    </div>
  );
};

export default VitalFilters;
