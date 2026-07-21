import React from 'react';
import { NOTIFICATION_TYPE_CONFIG } from '../constants/notification.constants';
import { Bell, Calendar, AlertTriangle, Stethoscope, Pill, Clock } from 'lucide-react';

const ICON_MAP = {
  Calendar,
  AlertTriangle,
  Stethoscope,
  Pill,
  Clock,
  Bell,
};

export const NotificationBadge = ({ type = 'System', isRead = false }) => {
  const config = NOTIFICATION_TYPE_CONFIG[type] || NOTIFICATION_TYPE_CONFIG.System;
  const IconComponent = ICON_MAP[config.iconName] || Bell;

  return (
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${config.colorClass}`}>
      <IconComponent className="w-4 h-4" />
    </div>
  );
};

export default NotificationBadge;
