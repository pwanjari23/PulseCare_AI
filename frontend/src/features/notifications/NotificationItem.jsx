import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { getNotificationItemConfig, getRelativeTimeAgo } from './notification.utils';
import { useMarkNotificationRead } from './notification.query';

export const NotificationItem = ({ notification, onSelect }) => {
  const markReadMutation = useMarkNotificationRead();

  const { title, message, isRead, type, createdAt, payload } = notification;
  const config = getNotificationItemConfig(type);
  const Icon = config.icon;
  const timeAgo = getRelativeTimeAgo(createdAt);

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (!isRead && notification.id) {
      markReadMutation.mutate(notification.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect && onSelect(notification)}
      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex items-start space-x-3 ${
        !isRead
          ? 'bg-accent/40 border-primary/20 hover:border-primary/40'
          : 'bg-card border-border/40 hover:bg-accent/30'
      }`}
    >
      {/* Type Icon */}
      <div className={`p-2 rounded-xl border shrink-0 ${config.bg}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-xs font-bold truncate ${!isRead ? 'text-foreground font-extrabold' : 'text-foreground/90'}`}>
            {title}
          </h4>
          <span className="text-[10px] font-mono text-muted-foreground flex items-center space-x-1 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {message}
        </p>

        {/* Payload Preview Badge if available */}
        {payload && (
          <div className="pt-1 flex flex-wrap gap-1.5">
            {Object.entries(payload).map(([k, v]) => (
              <span key={k} className="text-[9.5px] font-mono bg-card border border-border/60 px-1.5 py-0.5 rounded text-muted-foreground">
                <span className="font-semibold">{k}:</span> {String(v)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mark Read Action */}
      {!isRead && (
        <button
          onClick={handleMarkRead}
          className="p-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
          title="Mark as Read"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </motion.div>
  );
};

export default NotificationItem;
