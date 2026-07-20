import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES } from './notification.constants';
import { Bell } from 'lucide-react';

/**
 * Calculates relative time ago string (e.g. "5m ago", "2h ago", "1d ago")
 */
export const getRelativeTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = Math.max(0, now - past);

  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'Just now';

  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return past.toLocaleDateString();
};

/**
 * Returns icon, color, and label configuration for a notification type
 */
export const getNotificationItemConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || {
    label: 'Notification',
    icon: Bell,
    color: 'primary',
    bg: 'bg-primary/10 text-primary border-primary/20',
  };
};
