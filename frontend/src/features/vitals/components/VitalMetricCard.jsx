import React from 'react';
import { evaluateMetricStatus } from '../utils/vital.utils';
import { TRIAGE_CONFIG } from '../constants/vital.constants';
import { motion } from 'framer-motion';

export const VitalMetricCard = ({ title, value, unit, icon: Icon, metricKey, color = 'sky', subtext }) => {
  const status = metricKey ? evaluateMetricStatus(metricKey, value) : 'Normal';
  const config = TRIAGE_CONFIG[status] || TRIAGE_CONFIG.Normal;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-card border rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden transition-colors ${config.borderClass}`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${config.dotClass}`} />

      <div className="flex items-center justify-between pl-1">
        <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-accent/60 flex items-center justify-center text-foreground">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="pl-1 space-y-1">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-display leading-none">
            {value !== null && value !== undefined && value !== '' ? value : '--'}
          </span>
          {unit && <span className="text-xs font-semibold text-muted-foreground">{unit}</span>}
        </div>
        {subtext ? (
          <p className="text-[11px] text-muted-foreground truncate">{subtext}</p>
        ) : (
          <div className="flex items-center space-x-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.badgeClass}`}>
              {status}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VitalMetricCard;
