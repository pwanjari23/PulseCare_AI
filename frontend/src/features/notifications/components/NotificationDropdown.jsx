import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, ExternalLink, X } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { useMarkAllRead } from '../hooks/useMarkAllRead';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllReadMutation = useMarkAllRead();

  if (!isOpen) return null;

  const latestFive = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border border-border/60 rounded-3xl shadow-2xl z-50 p-4 font-sans space-y-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent text-xs transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4 text-emerald-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="Close notifications dropdown"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List items */}
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">Loading notifications...</div>
          ) : latestFive.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
              <Bell className="w-6 h-6 mx-auto text-muted-foreground/40" />
              <p>No notifications yet</p>
            </div>
          ) : (
            latestFive.map((n) => (
              <NotificationItem key={n.id} notification={n} onClick={onClose} />
            ))
          )}
        </div>

        {/* Footer View All */}
        <div className="pt-2 border-t border-border/40 text-center">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center space-x-1"
          >
            <span>View All Notifications</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationDropdown;
