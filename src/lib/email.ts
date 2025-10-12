
'use server';

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { ContractEmailTemplate } from '@/components/emails/contract-template';
import { type FormValues } from './schemas';

// Ensure these environment variables are set in your .env file
const smtpConfig = {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'apikey', // This is a literal string 'apikey' for SendGrid
        pass: process.env.SENDGRID_API_KEY,
    },
};

const senderEmail = process.env.SENDER_EMAIL;
const adminEmail = process.env.ADMIN_EMAIL;

export async function sendContractEmail(agreement: FormValues & {id: string, submittedAt: string}) {
    if (!process.env.SENDGRID_API_KEY) {
        console.error('SENDGRID_API_KEY is not set. Skipping email.');
        return;
    }
     if (!senderEmail || !adminEmail) {
        console.error('SENDER_EMAIL or ADMIN_EMAIL is not set. Skipping email.');
        return;
    }

    const transporter = nodemailer.createTransport(smtpConfig);

    const emailHtml = render(ContractEmailTemplate({ agreement }));

    const mailOptions = {
        from: `Dedicated Global Carrier LLC <${senderEmail}>`,
        to: agreement.email,
        cc: adminEmail,
        subject: `Your Trucking Service Agreement is Confirmed (ID: ${agreement.id})`,
        html: emailHtml,
        // attachments removed
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        // We throw the error so the calling function can decide how to handle it.
        throw new Error('Failed to send confirmation email.');
    }
}
