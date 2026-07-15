import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor: attach bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulsecare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: process standard response layout & map error details
axiosClient.interceptors.response.use(
  (response) => {
    // Return standard backend apiResponse object directly
    return response.data;
  },
  (error) => {
    // Extract standardized ApiError format returned by centralized error handler
    const standardError = error.response?.data || {
      success: false,
      message: error.message || 'An unexpected connection error occurred.',
      errors: [],
    };

    // If unauthorized, clean up session tokens
    if (error.response?.status === 401) {
      localStorage.removeItem('pulsecare_token');
    }

    return Promise.reject(standardError);
  }
);

export default axiosClient;
