/**
 * PulseCare AI – Email Config / Provider Instantiation
 */

const logger = require('#config/logger.js');
const SmtpProvider = require('../providers/smtp.provider');
const EmailService = require('../services/email.service');

// Resolve email provider
const providerType = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();
let provider;

if (providerType === 'smtp') {
  provider = new SmtpProvider();
} else {
  logger.warn(`Unknown email provider type: "${providerType}". Defaulting to SMTP provider.`);
  provider = new SmtpProvider();
}

// Instantiate and export singleton service
const emailService = new EmailService(provider);

module.exports = emailService;
