
import { FormValues } from '@/lib/schemas';
import * as React from 'react';

type AgreementData = FormValues & {
    id: string;
    submittedAt: string;
};

interface ContractEmailTemplateProps {
  agreement: AgreementData;
}

const containerStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  lineHeight: '1.6',
  color: '#333',
  maxWidth: '600px',
  margin: '0 auto',
  border: '1px solid #eee',
  padding: '20px',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
  marginBottom: '20px',
};

const logoStyle: React.CSSProperties = {
  width: '100px',
  height: 'auto',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginTop: '20px',
  marginBottom: '10px',
  borderBottom: '1px solid #ccc',
  paddingBottom: '5px',
};

const detailItemStyle: React.CSSProperties = {
  marginBottom: '8px',
};

const detailLabelStyle: React.CSSProperties = {
  fontWeight: 'bold',
};

const footerStyle: React.CSSProperties = {
  marginTop: '30px',
  paddingTop: '10px',
  borderTop: '1px solid #eee',
  textAlign: 'center',
  fontSize: '12px',
  color: '#888',
};

export const ContractEmailTemplate: React.FC<Readonly<ContractEmailTemplateProps>> = ({ agreement }) => {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const logoUrl = `${appUrl}/logo.png`;

    const services = [
        { label: 'Dedicated Lane Setup', value: agreement.dedicatedLaneSetup },
        { label: 'TWIC Card Application', value: agreement.twicCardApplication },
        { label: 'Trailer Rental', value: agreement.trailerRental },
        { label: 'Factoring Setup', value: agreement.factoringSetup },
        { label: 'Insurance Assistance', value: agreement.insuranceAssistance },
    ].filter(service => service.value);

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <img src={logoUrl} alt="Echo Logistics Inc Logo" style={logoStyle} />
                <h1>Service Agreement Confirmation</h1>
            </div>

            <p>Dear {agreement.carrierFullName},</p>
            <p>Thank you for submitting your service agreement. This email confirms that we have received your submission. Please keep this for your records.</p>

            <div style={sectionTitleStyle}>Agreement Summary</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Tracking ID:</span> {agreement.id}</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Submission Date:</span> {new Date(agreement.submittedAt).toLocaleString()}</div>

            <div style={sectionTitleStyle}>Carrier Information</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Carrier Full Name:</span> {agreement.carrierFullName}</div>
            {agreement.companyName && <div style={detailItemStyle}><span style={detailLabelStyle}>Company Name:</span> {agreement.companyName}</div>}
            <div style={detailItemStyle}><span style={detailLabelStyle}>MC Number:</span> {agreement.mcNumber}</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>DOT Number:</span> {agreement.dotNumber}</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Email:</span> {agreement.email}</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Phone Number:</span> {agreement.phoneNumber}</div>
            
            <div style={sectionTitleStyle}>Service & Payment Details</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Dispatch Company:</span> {agreement.dispatchCompany}</div>
            <div style={detailItemStyle}>
                <span style={detailLabelStyle}>Selected Services:</span>
                {services.length > 0 ? (
                    <ul>
                        {services.map(s => <li key={s.label}>{s.label.split(' $')[0]}</li>)}
                    </ul>
                ) : ' None'}
            </div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Payment Method:</span> {agreement.paymentMethod}</div>

            <div style={sectionTitleStyle}>Payment Payout Details</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Payout Method:</span> {agreement.howYouGetPaid === 'ach' ? 'ACH Direct Deposit' : 'Factoring'}</div>
            {agreement.howYouGetPaid === 'ach' && (
                <>
                    <div style={detailItemStyle}><span style={detailLabelStyle}>Bank Name:</span> {agreement.bankName}</div>
                    <div style={detailItemStyle}><span style={detailLabelStyle}>Account Number:</span> {agreement.accountNumber}</div>
                    <div style={detailItemStyle}><span style={detailLabelStyle}>Routing Number:</span> {agreement.routingNumber}</div>
                </>
            )}

            <div style={sectionTitleStyle}>Signature</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Signed By:</span> {agreement.printName} ({agreement.signature})</div>
            <div style={detailItemStyle}><span style={detailLabelStyle}>Date Signed:</span> {new Date(agreement.date).toLocaleDateString()}</div>

            <div style={footerStyle}>
                <p>Echo Logistics Inc.</p>
                <p>Email: frank@echologistics-inc.com</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
            </div>
        </div>
    );
};
