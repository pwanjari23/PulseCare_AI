import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const SummaryCard = ({ title, value, subtext, trend, trendType = 'up', icon: Icon, color = 'primary' }) => {
  const colorMap = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    healing: 'bg-healing-500/10 text-healing-600 dark:text-healing-400 border-healing-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  };

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorMap[color] || colorMap.primary}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold text-foreground font-display">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-bold ${
              trendType === 'up' ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {trendType === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </span>
        )}
      </div>

      {subtext && <p className="text-[11px] text-muted-foreground mt-1">{subtext}</p>}
    </div>
  );
};

export default SummaryCard;
