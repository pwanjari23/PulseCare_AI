import React from 'react';

export const DosageInput = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-[11px] font-semibold text-foreground">Dosage <span className="text-rose-500">*</span></label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 1 Tablet"
        className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
      />
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default DosageInput;
