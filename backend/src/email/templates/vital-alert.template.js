/**
 * PulseCare AI – Vital Alert Email Template
 */

const wrapWithLayout = require('./layout');

const vitalAlertTemplate = (data) => {
  let vitalsHtml = '';
  if (typeof data.vitals === 'object') {
    const fields = [
      { label: 'Heart Rate', val: data.vitals.heartRate, unit: 'bpm' },
      { label: 'Blood Oxygen (SpO2)', val: data.vitals.oxygenLevel || data.vitals.spo2, unit: '%' },
      { label: 'Temperature', val: data.vitals.temperature, unit: '°F' },
      { label: 'Systolic BP', val: data.vitals.systolicBp, unit: 'mmHg' },
      { label: 'Diastolic BP', val: data.vitals.diastolicBp, unit: 'mmHg' },
      { label: 'Blood Glucose', val: data.vitals.bloodGlucoseMgdl || data.vitals.glucose, unit: 'mg/dL' }
    ];

    vitalsHtml = fields
      .filter(f => f.val !== undefined && f.val !== null)
      .map(f => `
        <div style="padding: 12px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
          <span style="font-weight: 600; color: #475569;">${f.label}:</span>
          <span style="color: #0f172a;">${f.val} ${f.unit}</span>
        </div>
      `)
      .join('');
  } else {
    vitalsHtml = `<p style="color: #ef4444; font-weight: 600;">${data.vitals}</p>`;
  }

  const content = `
    <h1 style="color: #ef4444;">⚠️ Health Vital Alert</h1>
    <p>Dear ${data.patientName},</p>
    <p>One or more of the vital signs submitted recently are outside the standard target ranges.</p>
    
    <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; margin: 24px 0; overflow: hidden;">
      <div style="background-color: #ef4444; color: #ffffff; padding: 12px 16px; font-weight: 700;">
        Abnormal Vital Readings Detected
      </div>
      <div style="padding: 16px;">
        ${vitalsHtml}
      </div>
    </div>

    <p style="font-weight: 600; color: #0f172a;">What should you do?</p>
    <ul>
      <li>Stay calm and rest.</li>
      <li>If you have physical symptoms (e.g. chest pain, shortness of breath, severe dizziness), seek emergency medical care immediately.</li>
      <li>Your primary care doctor has been notified of this alert and will review it shortly.</li>
    </ul>

    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn" style="background-color: #ef4444;">View Vitals Log</a>
    </div>
  `;
  return wrapWithLayout('⚠️ PulseCare AI – Health Vital Alert', content);
};

module.exports = vitalAlertTemplate;
