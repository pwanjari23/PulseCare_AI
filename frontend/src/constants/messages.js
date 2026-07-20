export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully signed in to PulseCare portal.',
    LOGOUT: 'Logged out successfully.',
    VITALS_SAVED: 'Patient vitals logged successfully.',
    APPOINTMENT_CREATED: 'Appointment requested successfully.',
  },
  ERROR: {
    GENERIC: 'An unexpected clinical server error occurred. Please try again.',
    UNAUTHORIZED: 'Access denied. Please check your credentials.',
    NETWORK: 'Network error. Please check your internet connection.',
    REQUIRED: 'This clinical field is required.',
  },
};

export default MESSAGES;
