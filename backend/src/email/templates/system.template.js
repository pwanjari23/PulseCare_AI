/**
 * PulseCare AI – System Notification Email Template
 */

const wrapWithLayout = require('./layout');

const systemTemplate = (data) => {
  const content = `
    <h1>${data.title || 'System Notification'}</h1>
    <p>Dear ${data.recipientName || 'User'},</p>
    <p>${data.message}</p>
    <div style="text-align: center;">
      <a href="http://localhost:3000/login" class="btn">View Portal Notification</a>
    </div>
  `;
  return wrapWithLayout(data.title || 'PulseCare AI Notification', content);
};

module.exports = systemTemplate;
