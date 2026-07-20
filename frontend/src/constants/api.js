export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DOCTOR: {
    PROFILE: '/doctors/profile',
    AVAILABILITY: '/doctors/availability',
    PATIENTS: '/doctors/patients',
  },
  PATIENT: {
    PROFILE: '/patients/profile',
    VITALS: '/patients/vitals',
    PRESCRIPTIONS: '/patients/prescriptions',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    CREATE: '/appointments/create',
    CANCEL: (id) => `/appointments/${id}/cancel`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    READ: (id) => `/notifications/${id}/read`,
  },
};

export default API_ENDPOINTS;
