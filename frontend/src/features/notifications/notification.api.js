import axiosInstance from '../../services/api/axios';

export const notificationApi = {
  // Get all notifications for authenticated user
  getMyNotifications: (params) => {
    return axiosInstance.get('/notifications', { params });
  },

  // Get unread notifications
  getUnreadNotifications: () => {
    return axiosInstance.get('/notifications/unread');
  },

  // Get unread notification count
  getUnreadCount: () => {
    return axiosInstance.get('/notifications/unread-count');
  },

  // Mark a single notification as read
  markNotificationRead: (id) => {
    return axiosInstance.patch(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllNotificationsRead: () => {
    return axiosInstance.patch('/notifications/read-all');
  },

  // Admin endpoint to retrieve notifications for any target user ID
  getNotificationsForAdmin: (userId, params) => {
    return axiosInstance.get(`/notifications/user/${userId}`, { params });
  },
};

export default notificationApi;
