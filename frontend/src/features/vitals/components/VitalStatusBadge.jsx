import React from 'react';
import { TRIAGE_CONFIG } from '../constants/vital.constants';
import { evaluateOverallTriage } from '../utils/vital.utils';

export const VitalStatusBadge = ({ status, record, size = 'normal' }) => {
  const resolvedStatus = status || evaluateOverallTriage(record);
  const config = TRIAGE_CONFIG[resolvedStatus] || TRIAGE_CONFIG.Normal;

  const isSmall = size === 'small';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-bold rounded-full border transition-colors ${config.badgeClass} ${
        isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} animate-pulse`} />
      <span>{config.label}</span>
    </span>
  );
};

export default VitalStatusBadge;
