/**
 * PulseCare AI - RevenueOverview Component
 */

import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ShieldCheck } from 'lucide-react';

export const RevenueOverview = ({ className = '' }) => {
  return (
    <div className={`bg-card border border-border/60 rounded-3xl p-5 shadow-xs space-y-4 font-sans ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-500" /> Platform Revenue Insights
        </h4>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          +16.4% MoM
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Gross Monthly Revenue</span>
          <p className="text-lg font-black text-foreground font-mono">$28,450</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Consultation Fees Collected</span>
          <p className="text-lg font-black text-foreground font-mono">$22,100</p>
        </div>
        <div className="p-3 rounded-2xl bg-accent/30 border border-border/40 space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Platform Commission</span>
          <p className="text-lg font-black text-foreground font-mono">$6,350</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
