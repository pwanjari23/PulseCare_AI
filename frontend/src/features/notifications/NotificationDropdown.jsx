import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCheck, ExternalLink } from 'lucide-react';
import NotificationBell from './NotificationBell';
import NotificationItem from './NotificationItem';
import NotificationEmptyState from './NotificationEmptyState';
import NotificationSkeleton from './NotificationSkeleton';
import { useNotifications, useMarkAllNotificationsRead, useUnreadNotificationCount } from './notification.query';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: notificationsData, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notificationsList = Array.isArray(notificationsData)
    ? notificationsData
    : notificationsData?.notifications || [];

  const dropdownItems = notificationsList.slice(0, 10);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <NotificationBell isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-popover border border-border/60 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-foreground font-display">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <button
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending || unreadCount === 0}
              className="text-xs text-muted-foreground hover:text-primary disabled:opacity-40 transition-colors flex items-center space-x-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2 py-1">
            {isLoading ? (
              <NotificationSkeleton count={3} />
            ) : dropdownItems.length === 0 ? (
              <NotificationEmptyState compact />
            ) : (
              dropdownItems.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onSelect={() => setIsOpen(false)}
                />
              ))
            )}
          </div>

          {/* Footer link */}
          <div className="pt-2 border-t border-border/50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View Notification Center</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
