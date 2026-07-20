import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const authApi = {
  login: (credentials) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  registerPatient: (data) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER_PATIENT, data);
  },

  registerDoctor: (data) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER_DOCTOR, data);
  },

  refreshToken: (refreshToken) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  logout: (refreshToken) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  getProfile: () => {
    return axiosInstance.get(API_ENDPOINTS.AUTH.ME);
  },

  forgotPassword: (email) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: ({ token, newPassword, confirmPassword }) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword, confirmPassword });
  },
};

export default authApi;
