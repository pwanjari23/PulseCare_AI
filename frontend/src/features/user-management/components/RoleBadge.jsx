/**
 * PulseCare AI - RoleBadge Component
 */

import React from 'react';
import { ShieldCheck, Stethoscope, User } from 'lucide-react';
import { USER_ROLES, ROLE_CONFIG } from '../constants/user.constants';

const ICON_MAP = {
  ShieldCheck,
  Stethoscope,
  User,
};

export const RoleBadge = ({ role = USER_ROLES.PATIENT, size = 'default', className = '' }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG[USER_ROLES.PATIENT];
  const IconComp = ICON_MAP[config.icon] || User;

  const sizeClasses =
    size === 'small'
      ? 'px-2 py-0.5 text-[10px] font-mono font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  const iconSize = size === 'small' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full border shadow-2xs font-sans ${config.badgeClass} ${sizeClasses} ${className}`}
    >
      <IconComp className={iconSize} />
      <span>{config.label}</span>
    </span>
  );
};

export default RoleBadge;
