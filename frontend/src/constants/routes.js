export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER_PATIENT: '/register/patient',
  REGISTER_DOCTOR: '/register/doctor',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: '/dashboard',

  APPOINTMENTS: {
    BASE: '/appointments',
    BOOK: '/appointments/book',
    CALENDAR: '/appointments/calendar',
    DETAILS: (id) => `/appointments/${id || ':id'}`,
  },

  VITALS: {
    BASE: '/vitals',
    HISTORY: '/vitals/history',
    NEW: '/vitals/new',
    DETAILS: (id) => `/vitals/${id || ':id'}`,
  },

  DOCTOR: {
    DASHBOARD: '/doctor/dashboard',
    AVAILABILITY: '/doctor/availability',
    APPOINTMENTS: '/doctor/appointments',
  },
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    VITALS: '/patient/vitals',
    APPOINTMENTS: '/patient/appointments',
    PRESCRIPTIONS: '/patient/prescriptions',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
};

export default ROUTES;
