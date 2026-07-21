/**
 * PulseCare AI - HealthSummarySearch Component
 */

import React from 'react';
import { Search, X } from 'lucide-react';

export const HealthSummarySearch = ({ value = '', onChange, placeholder = 'Search summaries by patient, risk, or condition...', className = '' }) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-2xs"
        aria-label="Search Health Summaries"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          title="Clear search"
          aria-label="Clear search query"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default HealthSummarySearch;
