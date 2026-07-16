/**
 * PulseCare AI – Appointment Completed Email Template
 */

const wrapWithLayout = require('./layout');

const appointmentCompletedTemplate = (data) => {
  const content = `
    <h1>Consultation Completed</h1>
    <p>Dear ${data.recipientName},</p>
    <p>Your consultation with <strong>${data.otherPartyName}</strong> on <strong>${data.dateTime}</strong> has been marked as complete.</p>
    
    <p>You can access your portal to view any doctor notes, clinical summaries, or newly issued prescriptions resulting from this visit.</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn">View Consultation Records</a>
    </div>
    <div class="divider"></div>
    <p>Thank you for choosing PulseCare AI for your health management.</p>
  `;
  return wrapWithLayout('PulseCare AI – Consultation Completed', content);
};

module.exports = appointmentCompletedTemplate;
