export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',
  DASHBOARD: '/dashboard',
  
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
