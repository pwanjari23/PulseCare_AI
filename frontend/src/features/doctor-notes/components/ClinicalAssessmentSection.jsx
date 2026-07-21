import React from 'react';
import { ClipboardList } from 'lucide-react';

export const ClinicalAssessmentSection = ({ value, onChange, error, register }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-xs font-semibold text-foreground flex items-center space-x-1">
        <ClipboardList className="w-3.5 h-3.5 text-primary" />
        <span>Chief Complaint & Present Illness <span className="text-rose-500">*</span></span>
      </label>
      <textarea
        rows={3}
        {...register?.('chiefComplaint')}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Primary reasons for consultation, illness progression, duration..."
        className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      />
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default ClinicalAssessmentSection;
