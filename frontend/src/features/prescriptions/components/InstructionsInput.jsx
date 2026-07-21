import React from 'react';
import { FOOD_INSTRUCTION_OPTIONS } from '../constants/prescription.constants';

export const InstructionsInput = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-[11px] font-semibold text-foreground">Food & Take Instructions</label>
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
        >
          {FOOD_INSTRUCTION_OPTIONS.map(({ value: val, label }) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default InstructionsInput;
