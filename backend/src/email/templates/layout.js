/**
 * PulseCare AI – Email Layout Template Wrapper
 */

const wrapWithLayout = (title, contentHtml) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .header {
      background-color: #0f172a;
      padding: 32px 40px;
      text-align: center;
      border-bottom: 3px solid #0284c7;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .logo span {
      color: #0284c7;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 20px;
    }
    p {
      margin-top: 0;
      margin-bottom: 16px;
      color: #475569;
    }
    .btn {
      display: inline-block;
      background-color: #0284c7;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 24px;
      font-weight: 600;
      border-radius: 6px;
      margin: 24px 0;
      text-align: center;
    }
    .btn:hover {
      background-color: #0369a1;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 32px 40px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #0284c7;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .divider {
      border-top: 1px solid #e2e8f0;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="#" class="logo">PulseCare<span>AI</span></a>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin-bottom: 8px;">PulseCare AI remote patient monitoring and clinical system.</p>
        <p style="margin-bottom: 16px;">Need assistance? Contact our support team at <a href="mailto:support@pulsecare.ai">support@pulsecare.ai</a></p>
        <p style="font-size: 11px; margin-bottom: 0;">&copy; ${new Date().getFullYear()} PulseCare AI. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = wrapWithLayout;
