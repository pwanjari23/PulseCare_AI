import React from 'react';
import { motion } from 'framer-motion';

export const DashboardPage = ({ title, subtitle, actions, children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`space-y-6 ${className}`}
    >
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
          <div className="space-y-1">
            {title && <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight">{title}</h1>}
            {subtitle && <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-3 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default DashboardPage;
