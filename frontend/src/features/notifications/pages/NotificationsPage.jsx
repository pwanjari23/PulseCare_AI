import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell, RefreshCw, CheckCheck } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { filterNotifications } from '../utils/notification.utils';
import NotificationList from '../components/NotificationList';
import NotificationSearchBar from '../components/NotificationSearchBar';
import NotificationFilters from '../components/NotificationFilters';
import NotificationTabs from '../components/NotificationTabs';
import NotificationSkeleton from '../components/NotificationSkeleton';
import NotificationEmptyState from '../components/NotificationEmptyState';
import DeleteNotificationDialog from '../components/DeleteNotificationDialog';
import MarkAllReadDialog from '../components/MarkAllReadDialog';

export const NotificationsPage = () => {
  const { data: notifications = [], isLoading, error, refetch } = useNotifications();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showMarkAllRead, setShowMarkAllRead] = useState(false);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const totalCount = notifications.length;

  const filtered = useMemo(() => {
    // Merge active tab filter into type filter if needed
    const effectiveType = activeTab !== 'all' ? activeTab : typeFilter;
    return filterNotifications(notifications, {
      search,
      type: effectiveType,
      dateRange: dateFilter,
    });
  }, [notifications, search, activeTab, typeFilter, dateFilter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight flex items-center space-x-2">
            <Bell className="w-7 h-7 text-primary" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time alerts, clinical updates, appointment reminders, and system notifications.
          </p>
        </motion.div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          {unreadCount > 0 && (
            <button
              onClick={() => setShowMarkAllRead(true)}
              className="px-3.5 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-xl hover:bg-emerald-500/20 transition-all flex items-center space-x-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}

          <button
            onClick={() => refetch()}
            className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border/60 rounded-xl hover:bg-accent transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <NotificationTabs
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setTypeFilter('all');
        }}
        unreadCount={unreadCount}
        totalCount={totalCount}
      />

      {/* Search & Filters */}
      <div className="bg-card border border-border/60 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <NotificationSearchBar value={search} onChange={setSearch} />
        <NotificationFilters
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onReset={() => {
            setTypeFilter('all');
            setDateFilter('all');
            setSearch('');
          }}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <NotificationSkeleton count={4} />
      ) : error ? (
        <div className="text-center py-12 text-xs text-muted-foreground bg-card border border-border/60 rounded-3xl">
          <p className="text-foreground font-bold mb-2">Failed to load notifications</p>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <NotificationEmptyState
          title="No Notifications Found"
          description="There are no notifications matching your selected tab or search query."
        />
      ) : (
        <NotificationList notifications={filtered} onDelete={(n) => setDeleteTarget(n)} />
      )}

      {/* Dialogs */}
      <DeleteNotificationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        notification={deleteTarget}
      />

      <MarkAllReadDialog
        isOpen={showMarkAllRead}
        onClose={() => setShowMarkAllRead(false)}
      />
    </div>
  );
};

export default NotificationsPage;
