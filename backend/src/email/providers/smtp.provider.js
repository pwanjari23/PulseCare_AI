/**
 * PulseCare AI – SMTP Email Provider using Nodemailer
 */

const nodemailer = require('nodemailer');
const EmailProviderInterface = require('./email.interface');
const logger = require('#config/logger.js');

class SmtpProvider extends EmailProviderInterface {
  constructor() {
    super();
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const fromName = process.env.SMTP_FROM_NAME || 'PulseCare AI';
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@pulsecare.ai';

    this.from = `"${fromName}" <${fromEmail}>`;

    if (!host) {
      logger.warn('[SmtpProvider] SMTP_HOST environment variable not set. Falling back to JSON transport.');
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    } else {
      logger.info(`[SmtpProvider] Initializing SMTP transport on ${host}:${port}`);
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // Use secure connection for port 465
        auth: user && pass ? { user, pass } : undefined,
      });
    }
  }

  /**
   * Sends email using the configured transporter.
   */
  async send(options) {
    if (!options.to || typeof options.to !== 'string' || !options.to.includes('@')) {
      throw new Error('Invalid email address');
    }

    const mailOptions = {
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments || [],
      cc: options.cc,
      bcc: options.bcc,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      if (process.env.SMTP_HOST) {
        logger.info(`[SmtpProvider] Email sent successfully. MessageID: ${info.messageId}`);
      } else {
        // Log locally for JSON transport
        logger.info(`[SmtpProvider] [MOCK SEND] Email mock-sent to: ${options.to} | Subject: ${options.subject}`);
        logger.debug(`[SmtpProvider] Mock mail content: ${info.message}`);
      }
      return info;
    } catch (error) {
      logger.error(`[SmtpProvider] Failed to send email to ${options.to}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = SmtpProvider;
