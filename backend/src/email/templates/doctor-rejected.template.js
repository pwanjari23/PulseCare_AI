/**
 * PulseCare AI – Doctor Rejected Email Template
 */

const wrapWithLayout = require('./layout');

const doctorRejectedTemplate = (data) => {
  const content = `
    <h1>Application Update, Dr. ${data.firstName}</h1>
    <p>We regret to inform you that your application to join PulseCare AI as a medical provider has been declined at this time.</p>
    <p><strong>Reason for decision:</strong></p>
    <blockquote style="border-left: 4px solid #ef4444; padding-left: 16px; margin: 20px 0; color: #475569; font-style: italic;">
      ${data.reason || 'Verification of medical license or credentials could not be completed.'}
    </blockquote>
    <p>If you believe this decision was made in error or if you would like to submit additional credentials, please reach out to our administration team at <a href="mailto:credentialing@pulsecare.ai">credentialing@pulsecare.ai</a>.</p>
    <p>Thank you for your interest in PulseCare AI.</p>
  `;
  return wrapWithLayout('PulseCare AI – Registration Application Update', content);
};

module.exports = doctorRejectedTemplate;
