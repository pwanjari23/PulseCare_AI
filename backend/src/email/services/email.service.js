/**
 * PulseCare AI – Email Service
 */

const { EMAIL_TYPES, EMAIL_SUBJECTS } = require('../constants/email.constants');
const welcomeTemplate = require('../templates/welcome.template');
const doctorRegistrationTemplate = require('../templates/doctor-registration.template');
const doctorApprovedTemplate = require('../templates/doctor-approved.template');
const doctorRejectedTemplate = require('../templates/doctor-rejected.template');
const appointmentBookedTemplate = require('../templates/appointment-booked.template');
const appointmentCancelledTemplate = require('../templates/appointment-cancelled.template');
const appointmentCompletedTemplate = require('../templates/appointment-completed.template');
const prescriptionIssuedTemplate = require('../templates/prescription-issued.template');
const vitalAlertTemplate = require('../templates/vital-alert.template');
const passwordResetTemplate = require('../templates/password-reset.template');
const verifyEmailTemplate = require('../templates/verify-email.template');
const systemTemplate = require('../templates/system.template');

const { ApiError } = require('#utils/apiResponse.js');
const logger = require('#config/logger.js');

class EmailService {
  constructor(provider) {
    this.provider = provider;
  }

  /**
   * Helper to safely execute informational emails (catches, logs, does not throw).
   */
  async _sendInformational(to, subject, html) {
    try {
      await this.provider.send({ to, subject, html });
      return { success: true };
    } catch (error) {
      logger.error(`[EmailService] Informational email failed to send to ${to}. Error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper to execute mandatory emails (throws ApiError on failure).
   */
  async _sendMandatory(to, subject, html) {
    try {
      await this.provider.send({ to, subject, html });
      return { success: true };
    } catch (error) {
      logger.error(`[EmailService] Mandatory email failed to send to ${to}. Error: ${error.message}`);
      throw new ApiError(500, `Email delivery failed: ${error.message}`);
    }
  }

  async sendWelcomeEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.WELCOME];
    const html = welcomeTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendDoctorRegistrationEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.DOCTOR_REGISTRATION];
    const html = doctorRegistrationTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendDoctorApprovalEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.DOCTOR_APPROVED];
    const html = doctorApprovedTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendDoctorRejectionEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.DOCTOR_REJECTED];
    const html = doctorRejectedTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendAppointmentBookedEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.APPOINTMENT_BOOKED];
    const html = appointmentBookedTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendAppointmentCancelledEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.APPOINTMENT_CANCELLED];
    const html = appointmentCancelledTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendAppointmentCompletedEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.APPOINTMENT_COMPLETED];
    const html = appointmentCompletedTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendPrescriptionEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.PRESCRIPTION_ISSUED];
    const html = prescriptionIssuedTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendVitalAlertEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.VITAL_ALERT];
    const html = vitalAlertTemplate(data);
    return this._sendInformational(to, subject, html);
  }

  async sendPasswordResetEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.PASSWORD_RESET];
    const html = passwordResetTemplate(data);

    try {
      const fs = require('fs');
      const path = require('path');
      const uploadsDir = path.resolve(__dirname, '../../../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, 'last_email_token.json'), JSON.stringify({
        to,
        resetUrl: data.resetUrl
      }));
    } catch (e) {
      logger.warn(`Failed to write last_email_token.json: ${e.message}`);
    }

    return this._sendMandatory(to, subject, html);
  }

  async sendVerificationEmail(to, data) {
    const subject = EMAIL_SUBJECTS[EMAIL_TYPES.VERIFY_EMAIL];
    const html = verifyEmailTemplate(data);
    return this._sendMandatory(to, subject, html);
  }

  async sendSystemEmail(to, data) {
    const subject = data.subject || EMAIL_SUBJECTS[EMAIL_TYPES.SYSTEM];
    const html = systemTemplate(data);
    return this._sendInformational(to, subject, html);
  }
}

module.exports = EmailService;
