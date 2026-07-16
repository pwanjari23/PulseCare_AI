/**
 * PulseCare AI – Email Verification Template
 */

const wrapWithLayout = require('./layout');

const verifyEmailTemplate = (data) => {
  const content = `
    <h1>Verify Your Email Address</h1>
    <p>Dear ${data.firstName},</p>
    <p>Thank you for signing up for PulseCare AI. Please verify your email address to complete your registration and secure your account.</p>
    <div style="text-align: center;">
      <a href="${data.verifyUrl || 'http://localhost:3000/verify-email'}" class="btn">Verify Email Address</a>
    </div>
    <p>If the button above does not work, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; font-size: 13px; color: #0284c7;"><a href="${data.verifyUrl}">${data.verifyUrl}</a></p>
    <div class="divider"></div>
    <p>If you did not create a PulseCare AI account, please ignore this email.</p>
  `;
  return wrapWithLayout('PulseCare AI – Verify Your Email Address', content);
};

module.exports = verifyEmailTemplate;
