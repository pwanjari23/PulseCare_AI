/**
 * PulseCare AI – Doctor Approved Email Template
 */

const wrapWithLayout = require('./layout');

const doctorApprovedTemplate = (data) => {
  const content = `
    <h1>Congratulations, Dr. ${data.firstName}!</h1>
    <p>Your doctor profile on PulseCare AI has been verified and approved by our administrators.</p>
    <p>Your account is now fully active. You can log in to your provider dashboard to manage your availability, consult with patients, and issue prescriptions.</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn">Access Doctor Dashboard</a>
    </div>
    <div class="divider"></div>
    <p>Thank you for partnering with us to provide top-quality remote care to patients.</p>
  `;
  return wrapWithLayout('PulseCare AI – Your Account Has Been Approved!', content);
};

module.exports = doctorApprovedTemplate;
