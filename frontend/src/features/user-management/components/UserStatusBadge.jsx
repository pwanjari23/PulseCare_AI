/**
 * PulseCare AI - UserStatusBadge Component
 */

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { USER_STATUSES, STATUS_CONFIG } from '../constants/user.constants';

const ICON_MAP = {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
};

export const UserStatusBadge = ({ status = USER_STATUSES.ACTIVE, size = 'default', className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[USER_STATUSES.ACTIVE];
  const IconComp = ICON_MAP[config.icon] || CheckCircle2;

  const sizeClasses =
    size === 'small'
      ? 'px-2 py-0.5 text-[10px] font-mono font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  const iconSize = size === 'small' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs font-sans ${config.badgeClass} ${sizeClasses} ${className}`}
      role="status"
    >
      <IconComp className={iconSize} />
      <span>{config.label}</span>
    </span>
  );
};

export default UserStatusBadge;
