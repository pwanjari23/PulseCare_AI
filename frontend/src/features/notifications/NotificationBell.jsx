import React from 'react';
import { Bell } from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import { useUnreadNotificationCount } from './notification.query';

export const NotificationBell = ({ onClick, isOpen = false }) => {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 relative flex items-center justify-center ${
        isOpen ? 'bg-accent text-foreground' : ''
      }`}
      aria-label="Notifications"
      aria-expanded={isOpen}
    >
      <Bell className="w-4.5 h-4.5" />
      <NotificationBadge count={unreadCount} />
    </button>
  );
};

export default NotificationBell;
