/**
 * PulseCare AI - ReportFilters Component
 */

import React from 'react';
import { Filter, RotateCcw, RefreshCw } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

export const ReportFilters = ({
  timeframe = '30d',
  onTimeframeChange,
  statusFilter = 'ALL',
  onStatusChange,
  deptFilter = 'ALL',
  onDeptChange,
  onReset,
  onRefresh,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 font-sans ${className}`}>
      <DateRangePicker value={timeframe} onChange={onTimeframeChange} />

      {onStatusChange && (
        <div className="flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
            aria-label="Filter by Status"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      )}

      {onDeptChange && (
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Dept:</span>
          <select
            value={deptFilter}
            onChange={(e) => onDeptChange(e.target.value)}
            className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
            aria-label="Filter by Department"
          >
            <option value="ALL">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Practice">General Practice</option>
          </select>
        </div>
      )}

      <div className="flex items-center space-x-2 ml-auto">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-accent/30 hover:bg-accent border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-all"
            title="Reset Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportFilters;
