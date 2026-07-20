import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const vitalApi = {
  getVitals: (params) => {
    return axiosInstance.get(API_ENDPOINTS.PATIENT.VITALS, { params });
  },
  
  addVitalRecord: (data) => {
    return axiosInstance.post('/vitals', data);
  },

  getLatestVitals: (patientId) => {
    return axiosInstance.get(`/vitals/latest/${patientId}`);
  }
};

export default vitalApi;
