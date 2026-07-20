import axios from 'axios';
import toast from 'react-hot-toast';
import appConfig from '../../config/app.config';
import { STORAGE_KEYS } from '../../constants/storage';
import { ApiError, ValidationError, AuthorizationError, NetworkError } from '../../utils/errors';

// Dynamic import for useAuthStore to prevent circular dependencies
let useAuthStore;
const getAuthStore = async () => {
  if (!useAuthStore) {
    const module = await import('../../stores/auth.store');
    useAuthStore = module.useAuthStore;
  }
  return useAuthStore;
};

// Create a single Axios instance
const axiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue for pending requests during token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach access token
axiosInstance.interceptors.request.use(
  async (config) => {
    const authStoreModule = await getAuthStore();
    const token = authStoreModule.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(standardizeError(error));
  }
);

// Response Interceptor: Unwrap data & Auto-refresh tokens
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap the standardized response structure { success, message, data }
    if (response.data && response.data.hasOwnProperty('data')) {
      return response.data.data;
    }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops on refresh endpoint
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(standardizeError(error));
    }

    // 401 Unauthorized handling
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        // Send refresh request using standard axios to bypass interceptors
        const refreshResponse = await axios.post(`${appConfig.apiUrl}/auth/refresh`, {
          refreshToken,
        }, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        });

        // Backend response format: { success: true, data: { accessToken, refreshToken, user } }
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

        const authStoreModule = await getAuthStore();
        authStoreModule.getState().setAccessToken(newAccessToken);
        
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        const authStoreModule = await getAuthStore();
        authStoreModule.getState().clearAuth();

        toast.error('Session expired. Please sign in again.');
        
        // Redirect to login if on a protected page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(standardizeError(refreshError));
      }
    }

    return Promise.reject(standardizeError(error));
  }
);

// Standardize error formats
function standardizeError(error) {
  if (!error.response) {
    return new NetworkError('Cannot connect to the server. Please check your network connection.', error);
  }

  const status = error.response.status;
  const message = error.response.data?.message || error.message || 'An error occurred';
  const errors = error.response.data?.errors || [];

  if (status === 400 || status === 422) {
    return new ValidationError(message, status, errors);
  }

  if (status === 401 || status === 403) {
    return new AuthorizationError(message, status, errors);
  }

  return new ApiError(message, status, errors);
}

export default axiosInstance;
