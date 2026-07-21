import React from 'react';
import { Calendar } from 'lucide-react';

export const FollowUpSection = ({ value, onChange, error, register }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-xs font-semibold text-foreground flex items-center space-x-1">
        <Calendar className="w-3.5 h-3.5 text-amber-500" />
        <span>Recommended Follow-Up Date</span>
      </label>
      <input
        type="date"
        {...register?.('followUpDate')}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none font-mono"
      />
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default FollowUpSection;
