/**
 * PulseCare AI – Appointment Booked Email Template
 */

const wrapWithLayout = require('./layout');

const appointmentBookedTemplate = (data) => {
  const content = `
    <h1>Appointment Confirmed</h1>
    <p>Dear ${data.recipientName},</p>
    <p>An appointment has been successfully scheduled with <strong>${data.otherPartyName}</strong>.</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
      <tr>
        <td style="padding: 16px; font-weight: 600; color: #475569; width: 120px;">Date & Time</td>
        <td style="padding: 16px; color: #0f172a;">${data.dateTime}</td>
      </tr>
      ${data.reason ? `
      <tr>
        <td style="padding: 16px; font-weight: 600; color: #475569;">Reason</td>
        <td style="padding: 16px; color: #0f172a;">${data.reason}</td>
      </tr>
      ` : ''}
    </table>

    <p>If you need to make changes or cancel this booking, please do so via the portal at least 24 hours in advance.</p>
  `;
  return wrapWithLayout('PulseCare AI – Appointment Booking Confirmation', content);
};

module.exports = appointmentBookedTemplate;
