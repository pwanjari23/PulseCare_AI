/**
 * PulseCare AI - MetricCard Component
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const MetricCard = ({
  label,
  value,
  change = '+5.4%',
  isPositive = true,
  icon: IconComp,
  iconColor = 'text-primary bg-primary/10 border-primary/20',
  subText = 'vs last 30 days',
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs hover:border-border transition-all space-y-3 font-sans ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground">{label}</span>
        {IconComp && (
          <div className={`p-2 rounded-2xl border ${iconColor}`}>
            <IconComp className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-black text-foreground font-mono tracking-tight">{value}</span>
          {change && (
            <span
              className={`inline-flex items-center space-x-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
                isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{change}</span>
            </span>
          )}
        </div>
        {subText && <p className="text-[11px] text-muted-foreground mt-1.5 font-mono truncate">{subText}</p>}
      </div>
    </motion.div>
  );
};

export default MetricCard;
