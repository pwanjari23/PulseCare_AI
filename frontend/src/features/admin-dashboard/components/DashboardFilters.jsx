/**
 * PulseCare AI - DashboardFilters Component
 */

import React from 'react';
import { Filter, RotateCcw, RefreshCw } from 'lucide-react';
import { DATE_RANGES } from '../constants/dashboard.constants';

export const DashboardFilters = ({
  dateRange = '30d',
  onDateRangeChange,
  department = 'ALL',
  onDepartmentChange,
  onReset,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 bg-card border border-border/60 rounded-3xl p-4 shadow-xs font-sans ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Range:</span>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
            aria-label="Filter Date Range"
          >
            {DATE_RANGES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold text-muted-foreground">Department:</span>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
            aria-label="Filter Department"
          >
            <option value="ALL">All Specializations</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Practice">General Practice</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-accent/30 hover:bg-accent border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-all shadow-2xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardFilters;
