import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const appointmentApi = {
  getAppointments: (params) => {
    return axiosInstance.get(API_ENDPOINTS.APPOINTMENTS.BASE, { params });
  },
  
  createAppointment: (data) => {
    return axiosInstance.post(API_ENDPOINTS.APPOINTMENTS.CREATE, data);
  },
  
  cancelAppointment: (id) => {
    return axiosInstance.put(API_ENDPOINTS.APPOINTMENTS.CANCEL(id));
  },

  getAppointmentById: (id) => {
    return axiosInstance.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`);
  }
};

export default appointmentApi;
