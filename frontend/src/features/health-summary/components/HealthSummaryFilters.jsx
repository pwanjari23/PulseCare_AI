/**
 * PulseCare AI - HealthSummaryFilters Component
 */

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { RISK_LEVELS } from '../constants/healthSummary.constants';

export const HealthSummaryFilters = ({
  riskFilter = 'ALL',
  sortOrder = 'latest',
  onRiskChange,
  onSortChange,
  onReset,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-3 font-sans ${className}`}>
      {/* Risk Filter */}
      <div className="flex items-center space-x-1.5">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">Risk:</span>
        <select
          value={riskFilter}
          onChange={(e) => onRiskChange(e.target.value)}
          className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
          aria-label="Filter by Risk Level"
        >
          <option value="ALL">All Risk Levels</option>
          <option value={RISK_LEVELS.LOW}>Low Risk</option>
          <option value={RISK_LEVELS.MEDIUM}>Medium Risk</option>
          <option value={RISK_LEVELS.HIGH}>High Risk</option>
          <option value={RISK_LEVELS.CRITICAL}>Critical Risk</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="flex items-center space-x-1.5">
        <span className="text-xs font-semibold text-muted-foreground">Sort:</span>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs"
          aria-label="Sort Order"
        >
          <option value="latest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Reset */}
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-accent/30 hover:bg-accent border border-border/40 text-xs text-muted-foreground hover:text-foreground transition-all shadow-2xs"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default HealthSummaryFilters;
