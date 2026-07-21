/**
 * PulseCare AI - DateRangePicker Component
 */

import React from 'react';
import { Calendar } from 'lucide-react';
import { DATE_RANGE_OPTIONS } from '../constants/report.constants';

export const DateRangePicker = ({ value = '30d', onChange, className = '' }) => {
  return (
    <div className={`flex items-center space-x-1.5 font-sans ${className}`}>
      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs font-semibold text-muted-foreground">Range:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-accent/40 border border-border/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-primary transition-all shadow-2xs cursor-pointer"
        aria-label="Select Date Range"
      >
        {DATE_RANGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateRangePicker;
