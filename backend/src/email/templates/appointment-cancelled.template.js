/**
 * PulseCare AI – Appointment Cancelled Email Template
 */

const wrapWithLayout = require('./layout');

const appointmentCancelledTemplate = (data) => {
  const content = `
    <h1>Appointment Cancelled</h1>
    <p>Dear ${data.recipientName},</p>
    <p>We are writing to let you know that the appointment scheduled with <strong>${data.otherPartyName}</strong> on <strong>${data.dateTime}</strong> has been cancelled.</p>
    
    ${data.cancelledBy ? `<p><strong>Cancelled by:</strong> ${data.cancelledBy}</p>` : ''}
    
    <p>If this cancellation was unexpected or you need to reschedule, please visit your portal to book a new appointment slot.</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn">Go to Dashboard</a>
    </div>
  `;
  return wrapWithLayout('PulseCare AI – Appointment Cancellation Notice', content);
};

module.exports = appointmentCancelledTemplate;
