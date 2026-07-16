/**
 * PulseCare AI – Password Reset Email Template
 */

const wrapWithLayout = require('./layout');

const passwordResetTemplate = (data) => {
  const content = `
    <h1>Password Reset Request</h1>
    <p>Dear ${data.firstName},</p>
    <p>We received a request to reset the password for your PulseCare AI account.</p>
    <p>Click the button below to choose a new password. This link is only valid for a limited time.</p>
    <div style="text-align: center;">
      <a href="${data.resetUrl || 'http://localhost:3000/reset-password'}" class="btn">Reset Password</a>
    </div>
    <p>If the button above does not work, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; font-size: 13px; color: #0284c7;"><a href="${data.resetUrl}">${data.resetUrl}</a></p>
    <div class="divider"></div>
    <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
  `;
  return wrapWithLayout('PulseCare AI – Reset Password Request', content);
};

module.exports = passwordResetTemplate;
