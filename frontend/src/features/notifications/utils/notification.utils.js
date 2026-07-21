/**
 * PulseCare AI - Notification Utility Functions
 */

/**
 * Format relative time (e.g., '5 mins ago', '2 hours ago', 'Yesterday')
 */
export const formatNotificationTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const now = new Date();
  const diffSecs = Math.floor((now - d) / 1000);

  if (diffSecs < 60) return 'Just now';
  if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
  if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
  if (diffSecs < 172800) return 'Yesterday';

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Filter Notifications list by search term, status, type, and date range
 */
export const filterNotifications = (
  notifications = [],
  { search = '', type = 'all', dateRange = 'all' } = {}
) => {
  let result = [...notifications];

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter((n) => {
      const title = (n.title || '').toLowerCase();
      const message = (n.message || '').toLowerCase();
      const entity = (n.relatedEntity || '').toLowerCase();
      return title.includes(q) || message.includes(q) || entity.includes(q);
    });
  }

  if (type && type !== 'all') {
    if (type === 'unread') {
      result = result.filter((n) => !n.isRead);
    } else if (type === 'read') {
      result = result.filter((n) => n.isRead);
    } else {
      result = result.filter((n) => (n.notificationType || '').toLowerCase() === type.toLowerCase());
    }
  }

  if (dateRange && dateRange !== 'all') {
    const now = new Date();
    if (dateRange === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter((n) => new Date(n.createdAt) >= startOfDay);
    } else {
      const days = parseInt(dateRange, 10);
      if (!isNaN(days)) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        result = result.filter((n) => new Date(n.createdAt) >= cutoff);
      }
    }
  }

  return result;
};

/**
 * Resolve target route path for a notification based on relatedEntity
 */
export const getNotificationTargetRoute = (notification) => {
  if (!notification) return '/notifications';
  const entity = (notification.relatedEntity || '').toLowerCase();
  const id = notification.relatedEntityId;

  if (entity.includes('appointment')) {
    return id ? `/appointments/${id}` : '/appointments';
  }
  if (entity.includes('vital')) {
    return id ? `/vitals/${id}` : '/vitals';
  }
  if (entity.includes('prescription')) {
    return id ? `/prescriptions/${id}` : '/prescriptions';
  }
  if (entity.includes('doctor')) {
    return id ? `/doctors/${id}` : '/doctors';
  }

  return `/notifications/${notification.id}`;
};
