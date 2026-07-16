/**
 * PulseCare AI – Email Constants
 */

const EMAIL_TYPES = {
  WELCOME: 'WELCOME',
  DOCTOR_REGISTRATION: 'DOCTOR_REGISTRATION',
  DOCTOR_APPROVED: 'DOCTOR_APPROVED',
  DOCTOR_REJECTED: 'DOCTOR_REJECTED',
  APPOINTMENT_BOOKED: 'APPOINTMENT_BOOKED',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  APPOINTMENT_COMPLETED: 'APPOINTMENT_COMPLETED',
  PRESCRIPTION_ISSUED: 'PRESCRIPTION_ISSUED',
  VITAL_ALERT: 'VITAL_ALERT',
  PASSWORD_RESET: 'PASSWORD_RESET',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  SYSTEM: 'SYSTEM',
};

const EMAIL_SUBJECTS = {
  [EMAIL_TYPES.WELCOME]: 'Welcome to PulseCare AI',
  [EMAIL_TYPES.DOCTOR_REGISTRATION]: 'PulseCare AI – Registration Application Received',
  [EMAIL_TYPES.DOCTOR_APPROVED]: 'PulseCare AI – Your Account Has Been Approved!',
  [EMAIL_TYPES.DOCTOR_REJECTED]: 'PulseCare AI – Registration Application Update',
  [EMAIL_TYPES.APPOINTMENT_BOOKED]: 'PulseCare AI – Appointment Booking Confirmation',
  [EMAIL_TYPES.APPOINTMENT_CANCELLED]: 'PulseCare AI – Appointment Cancellation Notice',
  [EMAIL_TYPES.APPOINTMENT_COMPLETED]: 'PulseCare AI – Consultation Completed',
  [EMAIL_TYPES.PRESCRIPTION_ISSUED]: 'PulseCare AI – New Prescription Issued',
  [EMAIL_TYPES.VITAL_ALERT]: '⚠️ PulseCare AI – Health Vital Alert',
  [EMAIL_TYPES.PASSWORD_RESET]: 'PulseCare AI – Reset Password Request',
  [EMAIL_TYPES.VERIFY_EMAIL]: 'PulseCare AI – Verify Your Email Address',
  [EMAIL_TYPES.SYSTEM]: 'PulseCare AI – Notification',
};

module.exports = {
  EMAIL_TYPES,
  EMAIL_SUBJECTS,
};
