'use server';

import nodemailer from 'nodemailer';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey', // This is a literal string 'apikey'
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@example.com';

  const mailOptions = {
    from: SENDER_EMAIL,
    to: data.to,
    subject: data.subject,
    html: data.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${data.to}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email.' };
  }
};
