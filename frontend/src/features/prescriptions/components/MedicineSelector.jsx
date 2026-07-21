import React from 'react';
import { COMMON_MEDICATIONS } from '../constants/prescription.constants';

export const MedicineSelector = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-[11px] font-semibold text-foreground">Medicine Name & Strength <span className="text-rose-500">*</span></label>
      <input
        type="text"
        list="common-meds-list"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Amoxicillin 500mg"
        className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      />
      <datalist id="common-meds-list">
        {COMMON_MEDICATIONS.map((med) => (
          <option key={med} value={med} />
        ))}
      </datalist>
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default MedicineSelector;
