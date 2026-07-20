import React, { useState, useMemo, useEffect } from 'react';
import { CheckCheck, Bell, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth.store';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkAllNotificationsRead,
} from './notification.query';
import { initNotificationSocket, disconnectNotificationSocket } from './notification.socket';
import NotificationFilter from './NotificationFilter';
import NotificationList from './NotificationList';
import NotificationEmptyState from './NotificationEmptyState';
import NotificationSkeleton from './NotificationSkeleton';

export const NotificationCenter = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const { data, isLoading, isError, refetch } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAllReadMutation = useMarkAllNotificationsRead();

  // Initialize Socket.IO connection
  useEffect(() => {
    if (token) {
      initNotificationSocket(token, queryClient);
    }
    return () => {
      disconnectNotificationSocket();
    };
  }, [token, queryClient]);

  const rawList = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.notifications)) return data.notifications;
    return [];
  }, [data]);

  // Filtered Notifications List
  const filteredNotifications = useMemo(() => {
    return rawList.filter((n) => {
      // Status & Category Filter
      let filterMatch = true;
      if (activeFilter === 'unread') filterMatch = !n.isRead;
      else if (activeFilter === 'read') filterMatch = !!n.isRead;
      else if (activeFilter !== 'all') filterMatch = n.type === activeFilter;

      // Search Filter
      const search = searchTerm.toLowerCase();
      const titleMatch = (n.title || '').toLowerCase().includes(search);
      const msgMatch = (n.message || '').toLowerCase().includes(search);
      const searchMatch = !searchTerm || titleMatch || msgMatch;

      return filterMatch && searchMatch;
    });
  }, [rawList, activeFilter, searchTerm]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground font-display">Notification Center</h2>
          <p className="text-xs text-muted-foreground">Real-time alerts, appointment reminders, and clinical updates</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-card border border-border/60 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh Notifications"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending || unreadCount === 0}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-40 transition-all flex items-center space-x-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <NotificationFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Notification List Content */}
      {isLoading ? (
        <NotificationSkeleton count={5} />
      ) : isError ? (
        <div className="bg-card border border-rose-500/30 rounded-3xl p-8 text-center space-y-3">
          <p className="text-xs text-rose-500">Failed to load notifications from server.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-accent text-xs font-semibold rounded-xl"
          >
            Retry
          </button>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          onSelectNotification={(n) => setSelectedNotification(n)}
        />
      )}

      {/* Payload Details Preview Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-popover border border-border/60 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-primary">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedNotification.title}</h3>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedNotification.message}
            </p>

            {selectedNotification.payload && (
              <div className="p-3 rounded-2xl bg-accent/40 border border-border/50 space-y-1.5 text-xs">
                <h5 className="font-bold text-foreground flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Notification Telemetry Data</span>
                </h5>
                <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                  {Object.entries(selectedNotification.payload).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border/30 py-0.5">
                      <span className="capitalize">{k}:</span>
                      <span className="font-bold text-foreground">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
