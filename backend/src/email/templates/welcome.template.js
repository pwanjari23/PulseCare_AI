/**
 * PulseCare AI – Welcome Email Template
 */

const wrapWithLayout = require('./layout');

const welcomeTemplate = (data) => {
  const content = `
    <h1>Welcome to PulseCare AI, ${data.firstName}!</h1>
    <p>Thank you for registering. Your PulseCare AI account has been successfully created and is now active.</p>
    <p>You can log in to your patient portal to track your vitals, view notifications, schedule appointments, and review your prescriptions.</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn">Go to Patient Portal</a>
    </div>
    <div class="divider"></div>
    <p>If you did not register for this account, please contact our support team immediately.</p>
  `;
  return wrapWithLayout('Welcome to PulseCare AI', content);
};

module.exports = welcomeTemplate;
