import axios from 'axios';

// Create AXIOS instance configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor Placeholder
axiosInstance.interceptors.request.use(
  (config) => {
    // Placeholder: Add Authorization JWT token here before request is sent
    // const token = localStorage.getItem('pulsecare_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor Placeholder
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Placeholder: Handle global responses such as 401 Unauthorized or 403 Forbidden
    // if (error.response?.status === 401) {
    //   // Trigger token refresh or logout
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
