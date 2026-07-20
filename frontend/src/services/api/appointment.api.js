import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const appointmentApi = {
  // Patient retrieves their own bookings
  getMyAppointments: (params) => {
    return axiosInstance.get('/appointments/me', { params });
  },

  // Doctor retrieves their own calendar list
  getDoctorAppointments: (params) => {
    return axiosInstance.get('/appointments/doctor', { params });
  },

  // Admin / General list
  getAppointments: (params) => {
    return axiosInstance.get(API_ENDPOINTS.APPOINTMENTS.BASE, { params });
  },

  // Get single appointment details
  getAppointmentById: (id) => {
    return axiosInstance.get(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`);
  },

  // Book a new appointment
  bookAppointment: (data) => {
    return axiosInstance.post(API_ENDPOINTS.APPOINTMENTS.BASE, data);
  },

  // Cancel an appointment
  cancelAppointment: (id, reason) => {
    return axiosInstance.patch(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/cancel`, { reason });
  },

  // Doctor completes an appointment
  completeAppointment: (id, notes) => {
    return axiosInstance.patch(`${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}/complete`, { notes });
  },

  // Fetch doctor availability slots
  getAvailableSlots: (doctorId, date) => {
    return axiosInstance.get(`/availability/doctor/${doctorId}`, { params: { date } });
  },

  // Helper to fetch doctor directory for booking wizard
  getDoctorsList: () => {
    return axiosInstance.get('/doctors');
  },
};

export default appointmentApi;
