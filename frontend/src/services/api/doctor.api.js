import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const doctorApi = {
  getProfile: () => {
    return axiosInstance.get(API_ENDPOINTS.DOCTOR.PROFILE);
  },
  
  updateProfile: (data) => {
    return axiosInstance.put(API_ENDPOINTS.DOCTOR.PROFILE, data);
  },
  
  getPatients: () => {
    return axiosInstance.get(API_ENDPOINTS.DOCTOR.PATIENTS);
  },

  getDoctorById: (id) => {
    return axiosInstance.get(`/doctors/${id}`);
  },

  getProfileForAdmin: (id) => {
    return axiosInstance.get(`/admin/doctors/${id}`);
  }
};

export default doctorApi;
