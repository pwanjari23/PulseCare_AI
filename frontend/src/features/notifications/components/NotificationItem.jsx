import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NotificationBadge from './NotificationBadge';
import { formatNotificationTime, getNotificationTargetRoute } from '../utils/notification.utils';
import { useMarkAsRead } from '../hooks/useMarkAsRead';

export const NotificationItem = ({ notification, onClick }) => {
  const markAsReadMutation = useMarkAsRead();

  if (!notification) return null;

  const targetRoute = getNotificationTargetRoute(notification);

  const handleClick = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    onClick?.();
  };

  return (
    <Link
      to={targetRoute}
      onClick={handleClick}
      className={`block p-3.5 rounded-2xl border transition-all font-sans relative ${
        !notification.isRead
          ? 'bg-primary/5 border-primary/20 hover:bg-primary/10'
          : 'bg-card border-border/60 hover:bg-accent/40'
      }`}
    >
      <div className="flex items-start space-x-3">
        <NotificationBadge type={notification.notificationType} isRead={notification.isRead} />

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`text-xs truncate ${!notification.isRead ? 'font-extrabold text-foreground' : 'font-semibold text-muted-foreground'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
        </div>

        {!notification.isRead && (
          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
        )}
      </div>
    </Link>
  );
};

export default NotificationItem;
