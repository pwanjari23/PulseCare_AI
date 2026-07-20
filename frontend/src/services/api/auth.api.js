import axiosInstance from './axios';
import { API_ENDPOINTS } from '../../constants/api';

export const authApi = {
  login: (credentials) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  
  registerPatient: (data) => {
    return axiosInstance.post('/auth/register/patient', data);
  },
  
  registerDoctor: (data) => {
    return axiosInstance.post('/auth/register/doctor', data);
  },
  
  refreshToken: (token) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken: token });
  },
  
  logout: (token) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken: token });
  },
  
  getProfile: () => {
    return axiosInstance.get('/profile');
  },

  forgotPassword: (email) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  resetPassword: (token, password) => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  }
};

export default authApi;
