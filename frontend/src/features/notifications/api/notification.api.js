/**
 * PulseCare AI - Notification API Integration
 */

import axiosInstance from '../../../services/api/axios';

export const notificationApi = {
  /**
   * Fetch all notifications for current authenticated user
   */
  getMyNotifications: async (params) => {
    const res = await axiosInstance.get('/notifications', { params });
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch unread notifications
   */
  getUnreadNotifications: async () => {
    const res = await axiosInstance.get('/notifications/unread');
    return res.data?.data || res.data || [];
  },

  /**
   * Fetch total count of unread notifications
   */
  getUnreadCount: async () => {
    const res = await axiosInstance.get('/notifications/unread-count');
    const data = res.data?.data || res.data;
    if (typeof data === 'number') return data;
    return data?.unreadCount || data?.count || 0;
  },

  /**
   * Fetch single notification by ID
   */
  getNotificationById: async (id) => {
    try {
      const res = await axiosInstance.get(`/notifications/${id}`);
      return res.data?.data || res.data;
    } catch {
      // Client-side fallback if GET /notifications/:id is handled via list lookup
      const all = await notificationApi.getMyNotifications();
      return all.find((n) => String(n.id) === String(id)) || null;
    }
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (id) => {
    const res = await axiosInstance.patch(`/notifications/${id}/read`);
    return res.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllRead: async () => {
    const res = await axiosInstance.patch('/notifications/read-all');
    return res.data;
  },

  /**
   * Delete a notification by ID
   */
  deleteNotification: async (id) => {
    const res = await axiosInstance.delete(`/notifications/${id}`);
    return res.data;
  },
};

export default notificationApi;
