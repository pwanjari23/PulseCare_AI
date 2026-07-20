import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const patientApi = {
  getProfile: () => {
    return axiosInstance.get(API_ENDPOINTS.PATIENT.PROFILE);
  },
  
  updateProfile: (data) => {
    return axiosInstance.put(API_ENDPOINTS.PATIENT.PROFILE, data);
  },
  
  getVitals: () => {
    return axiosInstance.get(API_ENDPOINTS.PATIENT.VITALS);
  },

  getPatientById: (id) => {
    return axiosInstance.get(`/patients/${id}`);
  }
};

export default patientApi;
