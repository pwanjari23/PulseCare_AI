import { useNotificationStore } from '../stores/notification.store';

export const useNotification = () => {
  const {
    notifications,
    unreadCount,
    latestNotification,
    setNotifications,
    addNotification,
    markRead,
    clearNotifications,
  } = useNotificationStore();

  return {
    notifications,
    unreadCount,
    latestNotification,
    setNotifications,
    addNotification,
    markRead,
    clearNotifications,
  };
};

export default useNotification;
