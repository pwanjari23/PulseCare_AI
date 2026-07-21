import React from 'react';
import { MessageSquare } from 'lucide-react';

export const AdviceSection = ({ value, onChange, error, register }) => {
  return (
    <div className="space-y-1 font-sans">
      <label className="block text-xs font-semibold text-foreground flex items-center space-x-1">
        <MessageSquare className="w-3.5 h-3.5 text-teal-500" />
        <span>Patient Advice & Lifestyle Recommendations</span>
      </label>
      <textarea
        rows={2}
        {...register?.('advice')}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Dietary precautions, activity restrictions, warning signs to watch out for..."
        className="w-full px-3 py-2 bg-accent/30 border border-border/60 rounded-xl text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
      />
      {error && <p className="text-[10px] text-rose-500">{error}</p>}
    </div>
  );
};

export default AdviceSection;
