/**
 * PulseCare AI - TimezoneSelector Component
 */

import React from 'react';
import { Clock } from 'lucide-react';
import { TIMEZONES } from '../constants/settings.constants';

export const TimezoneSelector = ({ value = 'America/New_York (EST)', onChange, className = '' }) => {
  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      <label htmlFor="timezone-select" className="text-xs font-bold text-foreground flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-primary" /> Application Timezone
      </label>
      <select
        id="timezone-select"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3.5 py-2.5 bg-accent/40 hover:bg-accent/60 focus:bg-card border border-border/60 focus:border-primary rounded-2xl text-xs text-foreground outline-none transition-all shadow-2xs font-semibold"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimezoneSelector;
