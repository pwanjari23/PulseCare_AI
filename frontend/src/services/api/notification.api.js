import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const notificationApi = {
  getNotifications: () => {
    return axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
  },
  
  markAsRead: (id) => {
    return axiosInstance.put(API_ENDPOINTS.NOTIFICATIONS.READ(id));
  },
  
  markAllAsRead: () => {
    return axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/read-all`);
  }
};

export default notificationApi;
