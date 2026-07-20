import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  latestNotification: null,

  setNotifications: (list) => {
    const unread = list.filter(n => !n.isRead && !n.read).length;
    set({
      notifications: list,
      unreadCount: unread,
    });
  },

  addNotification: (notification) => {
    set((state) => {
      const updatedList = [notification, ...state.notifications];
      return {
        notifications: updatedList,
        unreadCount: state.unreadCount + 1,
        latestNotification: notification,
      };
    });
  },

  markRead: (id) => {
    set((state) => {
      const updatedList = state.notifications.map((n) => {
        if (n.id === id) {
          return { ...n, isRead: true, read: true };
        }
        return n;
      });
      const unread = updatedList.filter(n => !n.isRead && !n.read).length;
      return {
        notifications: updatedList,
        unreadCount: unread,
      };
    });
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
      latestNotification: null,
    });
  },
}));

export default useNotificationStore;
