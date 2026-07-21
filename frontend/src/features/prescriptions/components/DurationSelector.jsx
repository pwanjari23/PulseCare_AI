import React from 'react';
import { DURATION_OPTIONS } from '../constants/prescription.constants';

export const DurationSelector = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-[11px] font-semibold text-foreground">Duration (Days) <span className="text-rose-500">*</span></label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          max="365"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="e.g. 5"
          className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
        />
        <div className="flex gap-1">
          {DURATION_OPTIONS.slice(0, 4).map(({ value: val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                value === val ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border/60 text-muted-foreground hover:bg-accent'
              }`}
            >
              {val}d
            </button>
          ))}
        </div>
      </div>
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default DurationSelector;
