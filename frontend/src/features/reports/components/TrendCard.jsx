/**
 * PulseCare AI - TrendCard Component
 */

import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrendCard = ({ title, value, percentage, period = 'MoM Growth', isPositive = true, className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-card border border-border/60 rounded-3xl p-4 shadow-xs space-y-2 font-sans ${className}`}
    >
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>{title}</span>
        <span className="text-[10px] uppercase">{period}</span>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-xl font-black text-foreground font-mono">{value}</span>
        <span
          className={`inline-flex items-center space-x-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          <span>{percentage}</span>
        </span>
      </div>
    </motion.div>
  );
};

export default TrendCard;
