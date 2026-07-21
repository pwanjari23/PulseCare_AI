import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export const PrescriptionFilters = ({ statusFilter, onStatusFilterChange, onReset }) => {
  return (
    <div className="flex items-center space-x-2 font-sans">
      <div className="flex items-center space-x-1.5 text-xs text-muted-foreground mr-1">
        <Filter className="w-3.5 h-3.5" />
        <span className="font-semibold">Filter:</span>
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-3 py-1.5 bg-card border border-border/60 rounded-xl text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="expired">Expired</option>
        <option value="discontinued">Discontinued</option>
      </select>

      {statusFilter !== 'all' && (
        <button
          onClick={onReset}
          className="p-1.5 text-muted-foreground hover:text-foreground bg-accent/50 hover:bg-accent rounded-xl text-xs transition-colors flex items-center space-x-1"
          title="Reset filter"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">Reset</span>
        </button>
      )}
    </div>
  );
};

export default PrescriptionFilters;
