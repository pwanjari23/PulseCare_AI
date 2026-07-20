export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/profile',
    REFRESH: '/auth/refresh',
    REGISTER_PATIENT: '/auth/register/patient',
    REGISTER_DOCTOR: '/auth/register/doctor',
    FORGOT_PASSWORD: '/password-reset/forgot',
    RESET_PASSWORD: '/password-reset/reset',
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
