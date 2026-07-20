import React from 'react';
import { Activity } from 'lucide-react';

export const VitalCard = ({ title, value, unit, status = 'Normal', isAbnormal = false, rangeText, icon: Icon = Activity }) => {
  return (
    <div
      className={`bg-card border rounded-2xl p-5 shadow-sm transition-all duration-200 ${
        isAbnormal
          ? 'border-rose-500/40 bg-rose-500/5 ring-1 ring-rose-500/20'
          : 'border-border/60 hover:border-border/90'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{title}</span>
        <div
          className={`p-2 rounded-xl border ${
            isAbnormal
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-primary/10 text-primary border-primary/20'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline space-x-1.5">
        <span className="text-2xl font-extrabold text-foreground font-display">{value ?? 'N/A'}</span>
        {unit && <span className="text-xs font-semibold text-muted-foreground">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        {rangeText && <span className="text-muted-foreground">{rangeText}</span>}
        <span
          className={`font-semibold font-mono uppercase px-1.5 py-0.5 rounded text-[10px] ${
            isAbnormal ? 'bg-rose-500/10 text-rose-500 font-bold' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default VitalCard;
