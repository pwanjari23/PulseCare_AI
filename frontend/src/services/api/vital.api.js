import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const vitalApi = {
  // Patient retrieves their own history of vitals
  getMyVitals: (params) => {
    return axiosInstance.get('/vitals/me', { params });
  },

  // Patient retrieves their most recent vitals reading
  getLatestVital: () => {
    return axiosInstance.get('/vitals/latest');
  },

  // Patient logs a new vital reading
  recordVital: (data) => {
    return axiosInstance.post('/vitals', data);
  },

  // Patient updates a logged vital reading
  updateVital: (id, data) => {
    return axiosInstance.put(`/vitals/${id}`, data);
  },

  // Patient deletes a logged vital reading
  deleteVital: (id) => {
    return axiosInstance.delete(`/vitals/${id}`);
  },

  // Doctor or Admin retrieves vital logs of a target patient ID
  getPatientVitals: (patientId, params) => {
    return axiosInstance.get(`/vitals/patient/${patientId}`, { params });
  },

  // Fallback alias for general query compatibility
  getVitals: (params) => {
    return axiosInstance.get(API_ENDPOINTS.PATIENT?.VITALS || '/vitals/me', { params });
  },
};

export default vitalApi;
