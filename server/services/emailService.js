const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[EMAIL SIMULATED] To: ${to} | Subject: ${subject} | Content: ${text}`);
    return { messageId: 'simulated-id-' + Date.now() };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const message = {
      from: `"Workflow OS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(message);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    console.log(`[EMAIL FALLBACK] Failed to send actual email. Details: To: ${to} | Subject: ${subject}`);
    return { messageId: 'fallback-id-' + Date.now() };
  }
};

module.exports = sendEmail;