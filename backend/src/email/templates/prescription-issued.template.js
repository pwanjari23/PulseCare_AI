/**
 * PulseCare AI – Prescription Issued Email Template
 */

const wrapWithLayout = require('./layout');

const prescriptionIssuedTemplate = (data) => {
  const itemsHtml = (data.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; font-weight: 600; color: #0f172a;">${item.medicationName || item.medicineName || 'Medication'}</td>
        <td style="padding: 12px; color: #475569;">${item.dosage || ''}</td>
        <td style="padding: 12px; color: #475569;">${item.frequency || ''}</td>
        <td style="padding: 12px; color: #475569;">${item.durationDays ? `${item.durationDays} days` : ''}</td>
      </tr>
      ${item.instructions ? `
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #fafafa;">
        <td colspan="4" style="padding: 8px 12px; font-size: 12px; color: #64748b; font-style: italic;">
          Instructions: ${item.instructions}
        </td>
      </tr>
      ` : ''}
    `
    )
    .join('');

  const content = `
    <h1>New Prescription Issued</h1>
    <p>Dear ${data.patientName},</p>
    <p>Dr. <strong>${data.doctorName}</strong> has issued a new prescription for you.</p>
    
    ${data.diagnosis ? `<p><strong>Diagnosis:</strong> ${data.diagnosis}</p>` : ''}
    
    <h3 style="margin-top: 24px; font-size: 16px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Prescribed Medications</h3>
    
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr style="background-color: #f1f5f9; text-align: left;">
          <th style="padding: 12px; font-size: 13px; color: #475569;">Medication</th>
          <th style="padding: 12px; font-size: 13px; color: #475569;">Dosage</th>
          <th style="padding: 12px; font-size: 13px; color: #475569;">Frequency</th>
          <th style="padding: 12px; font-size: 13px; color: #475569;">Duration</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748b;">No items listed</td></tr>'}
      </tbody>
    </table>

    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn">View in Patient Portal</a>
    </div>
  `;
  return wrapWithLayout('PulseCare AI – New Prescription Issued', content);
};

module.exports = prescriptionIssuedTemplate;
