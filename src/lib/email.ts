
'use server';

import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { ContractEmailTemplate } from '@/components/emails/contract-template';
import type { FormValues } from '@/lib/schemas';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

type AgreementData = FormValues & {
    id: string;
    submittedAt: string;
};

export async function sendContractEmail(agreement: AgreementData) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        console.error('ADMIN_EMAIL environment variable is not set. Cannot send admin copy.');
        throw new Error('Server configuration error: ADMIN_EMAIL is not set.');
    }

    if (!process.env.SMTP_HOST) {
         console.error('SMTP configuration is missing. Cannot send email.');
         throw new Error('Server configuration error: SMTP is not configured.');
    }

    const emailHtml = render(ContractEmailTemplate({ agreement }));

    const options = {
        from: `Echo Logistics Inc <${process.env.SMTP_USER}>`,
        to: agreement.email,
        cc: adminEmail,
        subject: `Your Service Agreement Confirmation - ID: ${agreement.id}`,
        html: emailHtml,
    };

    try {
        await transporter.sendMail(options);
        console.log(`Email sent for agreement ${agreement.id} to ${agreement.email} and ${adminEmail}`);
    } catch (error) {
        console.error(`Failed to send email for agreement ${agreement.id}:`, error);
        throw new Error('Failed to send contract email. Please check SMTP configuration and logs.');
    }
}
