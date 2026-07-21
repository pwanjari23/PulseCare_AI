/**
 * PulseCare AI - SummaryStatusBadge Component
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldAlert } from 'lucide-react';
import { RISK_LEVELS, RISK_CONFIG } from '../constants/healthSummary.constants';

const ICON_MAP = {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
};

export const SummaryStatusBadge = ({ riskLevel = RISK_LEVELS.LOW, size = 'default', className = '' }) => {
  const config = RISK_CONFIG[riskLevel] || RISK_CONFIG[RISK_LEVELS.LOW];
  const IconComponent = ICON_MAP[config.icon] || CheckCircle2;

  const sizeClasses =
    size === 'small'
      ? 'px-2 py-0.5 text-[11px] font-semibold tracking-wide'
      : size === 'large'
      ? 'px-3.5 py-1.5 text-xs font-bold'
      : 'px-2.5 py-1 text-xs font-semibold';

  const iconSizes = size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs font-sans transition-colors ${config.badgeClass} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Health Risk Status: ${config.label}`}
    >
      <IconComponent className={iconSizes} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};

export default SummaryStatusBadge;
