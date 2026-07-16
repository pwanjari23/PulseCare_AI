/**
 * PulseCare AI – Doctor Registration Confirmation Email Template
 */

const wrapWithLayout = require('./layout');

const doctorRegistrationTemplate = (data) => {
  const content = `
    <h1>Application Received, Dr. ${data.firstName}!</h1>
    <p>Thank you for submitting your application to join PulseCare AI as a medical provider.</p>
    <p>Your application is currently under administrative review. We will verify your license details and credentials shortly.</p>
    <p>Once your profile is reviewed and approved, you will receive an email letting you know you can log in to start treating patients.</p>
    <p>We appreciate your patience during this process.</p>
  `;
  return wrapWithLayout('PulseCare AI – Registration Application Received', content);
};

module.exports = doctorRegistrationTemplate;
