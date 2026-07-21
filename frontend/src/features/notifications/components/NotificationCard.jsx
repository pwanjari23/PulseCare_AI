import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Trash2, ExternalLink } from 'lucide-react';
import NotificationBadge from './NotificationBadge';
import { formatNotificationTime, getNotificationTargetRoute } from '../utils/notification.utils';
import { useMarkAsRead } from '../hooks/useMarkAsRead';

export const NotificationCard = ({ notification, onDelete }) => {
  const markAsReadMutation = useMarkAsRead();

  if (!notification) return null;

  const targetRoute = getNotificationTargetRoute(notification);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`bg-card border rounded-3xl p-5 shadow-sm transition-all space-y-3 font-sans relative ${
        !notification.isRead ? 'border-primary/40 bg-primary/5' : 'border-border/60 hover:border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <NotificationBadge type={notification.notificationType} isRead={notification.isRead} />
          <div>
            <h4 className={`text-sm ${!notification.isRead ? 'font-extrabold text-foreground' : 'font-bold text-foreground/80'}`}>
              {notification.title}
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {!notification.isRead && (
            <button
              onClick={() => markAsReadMutation.mutate(notification.id)}
              className="p-1.5 rounded-xl text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/20 transition-colors"
              title="Mark as read"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete?.(notification)}
            className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            title="Delete notification"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed pl-1">
        {notification.message}
      </p>

      <div className="flex justify-end pt-2 border-t border-border/40">
        <Link
          to={targetRoute}
          onClick={() => !notification.isRead && markAsReadMutation.mutate(notification.id)}
          className="text-xs font-bold text-primary hover:underline inline-flex items-center space-x-1"
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
