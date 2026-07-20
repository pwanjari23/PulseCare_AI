import React from 'react';
import { motion } from 'framer-motion';

export const HealthSummaryCard = ({ title, value, subtext, icon: Icon, color = 'primary', loading = false }) => {
  if (loading) {
    return (
      <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-accent rounded-md w-1/2" />
          <div className="w-9 h-9 bg-accent rounded-xl" />
        </div>
        <div className="h-6 bg-accent rounded-md w-3/4" />
        <div className="h-3 bg-accent rounded-md w-2/3" />
      </div>
    );
  }

  const colorVariants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    healing: 'bg-healing-500/10 text-healing-600 dark:text-healing-400 border-healing-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  const badgeClass = colorVariants[color] || colorVariants.primary;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border/60 hover:border-border/90 rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-xl border ${badgeClass}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-extrabold text-foreground font-display tracking-tight">{value ?? 'N/A'}</h3>
        {subtext && <p className="text-xs text-muted-foreground mt-1 truncate">{subtext}</p>}
      </div>
    </motion.div>
  );
};

export default HealthSummaryCard;
